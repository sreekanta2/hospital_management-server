import fs from "fs";
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import {
  avatarUploaded,
  deleteAvatar,
  deleteGalleryImages,
  uploadGalleryImages,
} from "../../../utils/cloudinary";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IDoctor } from "./interface";
import { Doctor } from "./model";

const updateDoctor = async (
  avatar: string,
  galleryImages: Express.Multer.File[],
  payload: IDoctor,
  id: string
) => {
  try {
    const existingDoctor = await Doctor.findById(id);

    if (!existingDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found!");
    }

    const savedAvatar = await avatarUploaded(
      avatar,
      existingDoctor.avatar.public_id
    );
    if (!savedAvatar) {
      throw new ApiError(httpStatus.BAD_REQUEST, "avatar  uploaded field!");
    }
    existingDoctor.avatar = {
      url: savedAvatar.secure_url,
      public_id: savedAvatar.public_id,
    };

    // If gallery images are provided, update them

    const savedGalleryImages = await uploadGalleryImages(
      galleryImages,
      existingDoctor.gallery
    );
    if (!savedGalleryImages) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "gallery images  uploaded field!"
      );
    }

    existingDoctor.set({
      ...payload,
      avatar: {
        url: existingDoctor.avatar.url,
        public_id: existingDoctor.avatar.public_id,
      },
      gallery: savedGalleryImages,
    });
    const updatedDoctor = await existingDoctor.save();
    return updatedDoctor;
  } catch (error) {
    if (avatar) {
      fs.unlinkSync(avatar);
    }
    if (galleryImages) {
      galleryImages.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
    errorLogger.error("Error updating doctor profile:", error);
  }
};

const getAllDoctor = async (
  options: IPaginationOptions,
  filter: IFilterableFields
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const { searchTerm, ...filterableData } = filter;
  const conditionalSorting: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    conditionalSorting[sortBy] = sortOrder;
  }
  // searching query
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterableData).length) {
    andCondition.push({
      $and: Object.entries(filterableData).map(([field, value]) => ({
        [field]: [value],
      })),
    });
  }

  const whereCondition = andCondition.length > 0 ? { $and: andCondition } : {};
  const doctors = await Doctor.find(whereCondition)
    .sort()
    .skip(skip)
    .limit(limit);
  const total = await Doctor.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: doctors,
  };
};

const getSingleDoctor = async (doctorId: string) => {
  console.log(doctorId);
  const doctor = await Doctor.findById(doctorId).populate({
    path: "userId",
  });
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, "Doctor not exit !");
  }
  return doctor;
};
const deleteDoctor = async (id: string) => {
  try {
    const exitDoctor = await Doctor.findById({ _id: id });

    if (!exitDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, "doctor not found!");
    }
    // delete
    await deleteAvatar(exitDoctor?.avatar.public_id);
    await deleteGalleryImages(exitDoctor.gallery);

    const doctor = await Doctor.deleteOne({ _id: id });

    // Check if the deletion was acknowledged
    if (doctor.deletedCount === 0 && doctor.acknowledged) {
      throw new Error("Failed to delete user");
    }

    return {
      doctor,

      success: true,
    };
  } catch (error) {
    console.log(error);
    // If an error occurs during the transaction, catch it and abort the transaction

    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor and user delete field");
  }
};
export const DoctorService = {
  getAllDoctor,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
};
