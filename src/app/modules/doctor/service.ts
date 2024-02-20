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
  multipleFilesDelete,
  multipleFilesUpdate,
  multipleFilesUpload,
  singleFileDelete,
  singleFileUpdated,
  singleFileUploaded,
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

    if (avatar && existingDoctor.avatar.public_id) {
      const savedAvatar = await singleFileUpdated(
        avatar,
        existingDoctor.avatar.public_id
      );

      if (!savedAvatar) {
        throw new ApiError(httpStatus.BAD_REQUEST, "avatar  update  field!");
      }
      existingDoctor.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    } else {
      const savedAvatar = await singleFileUploaded(avatar);
      if (!savedAvatar) {
        throw new ApiError(httpStatus.BAD_REQUEST, "avatar  uploaded field!");
      }
      existingDoctor.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    }
    let savedGalleryImages;
    if (
      Array.isArray(existingDoctor.gallery) &&
      existingDoctor.gallery.length > 0 &&
      galleryImages.length > 0
    ) {
      savedGalleryImages = await multipleFilesUpdate(
        galleryImages,
        existingDoctor.gallery
      );
      if (!savedGalleryImages) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "gallery images  updated field!"
        );
      }
    } else {
      savedGalleryImages = await multipleFilesUpload(galleryImages);
      if (!savedGalleryImages) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "gallery images  uploaded field!"
        );
      }
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

    errorLogger.error(error);
    throw new Error(`${error}`);
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
  try {
    const doctors = await Doctor.find(whereCondition)
      .sort()
      .skip(skip)
      .limit(limit);
    const total = await Doctor.countDocuments();

    if (doctors) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "something went wrong of doctor find doctor "
      );
    }
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: doctors,
    };
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

const getSingleDoctor = async (doctorId: string) => {
  try {
    const doctor = await Doctor.findById(doctorId).populate({
      path: "userId",
    });
    if (!doctor) {
      throw new ApiError(httpStatus.NOT_FOUND, "Doctor not exit !");
    }
    return doctor;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const deleteDoctor = async (id: string) => {
  try {
    const exitDoctor = await Doctor.findById({ _id: id });

    if (!exitDoctor) {
      throw new ApiError(httpStatus.NOT_FOUND, "doctor not found!");
    }
    // delete
    await singleFileDelete(exitDoctor?.avatar.public_id);
    await multipleFilesDelete(exitDoctor.gallery);

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
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
export const DoctorService = {
  getAllDoctor,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
};
