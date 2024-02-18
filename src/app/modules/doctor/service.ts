import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";

import {
  deleteImageOnCloudinary,
  fileUploadOnCloudinary,
} from "../../../utils/cloudinary";
import { IDoctor, IGallery } from "./interface";
import { Doctor } from "./model";

import fs from "fs";
import { errorLogger } from "../../../shared/logger";
import { generateDoctorId } from "./utils";

const createDoctor = async (
  payload: IDoctor,
  loggedInUser: JwtPayload,
  profile_thumb: string,
  galleryImages: Express.Multer.File[]
) => {
  try {
    const id = await generateDoctorId();

    const IsExitDoctor = await Doctor.findOne(
      { email: loggedInUser.email },
      { email: 1 }
    );

    if (IsExitDoctor) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Doctor profile already created, please update your profile!"
      );
    }

    const profile = await fileUploadOnCloudinary(profile_thumb);

    if (!profile) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Profile pic upload failed!");
    }

    const profileImage = {
      url: profile.secure_url,
      public_id: profile.public_id,
    };

    const gallery: IGallery[] = [];
    if (galleryImages) {
      const uploadPromises = galleryImages.map(async (image) => {
        const galleryImage = await fileUploadOnCloudinary(image.path);

        gallery.push({
          url: galleryImage?.secure_url,
          public_id: galleryImage?.public_id,
        });
      });
      await Promise.all(uploadPromises);
    }

    payload.id = id;
    payload.email = loggedInUser.email;
    payload.profile_thumb = profileImage;
    payload.gallery = gallery;

    const doctor = await Doctor.create(payload);
    if (!doctor) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create doctor profile please try again !!!"
      );
    }
    const newDoctor = await Doctor.findById(doctor._id).populate({
      path: "userId",
    });

    if (!newDoctor) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Patient failed to create his profile!"
      );
    }

    return newDoctor;
  } catch (error) {
    if (profile_thumb) {
      fs.unlinkSync(profile_thumb);
    }
    if (galleryImages) {
      galleryImages.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
    errorLogger.error("Error creating doctor profile:", error);
  }
};

const updateDoctor = async (
  profile_thumb: string,
  galleryImages: Express.Multer.File[],
  payload: IDoctor,
  id: string
) => {
  try {
    const isExit = await Doctor.findOne({ id: id });

    if (!isExit) {
      throw new ApiError(httpStatus.NOT_FOUND, "doctor not found!");
    }
    // delete
    if (profile_thumb && isExit.profile_thumb.public_id) {
      await deleteImageOnCloudinary(isExit.profile_thumb.public_id);
    }
    if (galleryImages.length > 0 && isExit.gallery.length > 0) {
      const deletedPromise = isExit.gallery.map(async (image) => {
        await deleteImageOnCloudinary(image?.public_id);
      });
      await Promise.all(deletedPromise);
    }

    // new uploading
    const profile = await fileUploadOnCloudinary(profile_thumb);

    if (!profile) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Profile pic upload failed!");
    }

    const profileImage = {
      url: profile.secure_url,
      public_id: profile.public_id,
    };

    const gallery: IGallery[] = [];
    if (galleryImages) {
      const uploadPromises = galleryImages.map(async (image) => {
        const galleryImage = await fileUploadOnCloudinary(image.path);

        gallery.push({
          url: galleryImage?.secure_url,
          public_id: galleryImage?.public_id,
        });
      });
      await Promise.all(uploadPromises);
    }

    payload.id = id;

    payload.profile_thumb = profileImage;
    payload.gallery = gallery;

    const doctor = await Doctor.findOneAndUpdate({ id: id }, payload, {
      new: true,
    });

    return doctor;
  } catch (error) {
    if (profile_thumb) {
      fs.unlinkSync(profile_thumb);
    }
    if (galleryImages) {
      galleryImages.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
    errorLogger.error("Error creating doctor profile:", error);
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

const getSingleDoctor = async (payload: string) => {
  const doctor = await Doctor.findOne({
    $or: [{ email: payload }, { id: payload }],
  }).populate({
    path: "userId",
  });
  return doctor;
};
const deleteDoctor = async (id: string) => {
  try {
    const isExit = await Doctor.findOne({ id: id });

    if (!isExit) {
      throw new ApiError(httpStatus.NOT_FOUND, "doctor not found!");
    }
    // delete
    if (isExit.profile_thumb.public_id) {
      await deleteImageOnCloudinary(isExit.profile_thumb.public_id);
    }
    if (isExit.gallery.length > 0) {
      const deletedPromise = isExit.gallery.map(async (image) => {
        await deleteImageOnCloudinary(image?.public_id);
      });
      await Promise.all(deletedPromise);
    }

    const doctor = await Doctor.deleteOne({ id });

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
  createDoctor,
  getAllDoctor,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
};
