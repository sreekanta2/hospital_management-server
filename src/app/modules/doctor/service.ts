import fs from "fs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { User } from "../user/model";
import { IDoctor } from "./interface";
import { Doctor } from "./model";
import { updateAvatar, updateGalleryImages, updateUserData } from "./utils";

// Main function to update user and doctor information
const updateDoctor = async (
  avatar: string,
  galleryImages: Express.Multer.File[],
  payload: IDoctor,
  id: string,
  user: JwtPayload
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [existingUser, existingDoctor] = await Promise.all([
      User.findOne({ email: user.email }),
      Doctor.findById(id),
    ]);
    if (!existingDoctor || !existingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "User and doctor not found!");
    }

    const [updatedUser, updatedGalleryImages, avatarImages] = await Promise.all(
      [
        updateUserData(payload, existingUser),
        updateGalleryImages(galleryImages, existingDoctor),
        updateAvatar(avatar, existingUser),
      ]
    );

    existingDoctor.set({
      ...payload,
      avatar: {
        url: avatarImages.secure_url,
        public_id: avatarImages.public_id,
      },
      gallery: updatedGalleryImages,
    });

    const updatedDoctorResult = await existingDoctor.save({ session });
    await session.commitTransaction();
    session.endSession();

    return [updatedUser, updatedDoctorResult];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (avatar) {
      fs.unlinkSync(avatar);
    }
    if (galleryImages) {
      galleryImages.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }

    errorLogger.error(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
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

    if (!doctors) {
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

export const DoctorService = {
  getAllDoctor,
  updateDoctor,
};
