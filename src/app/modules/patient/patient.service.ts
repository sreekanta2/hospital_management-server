import fs from "fs";
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import ApiError from "../../../utils/ApiError";
import {
  deleteImageOnCloudinary,
  fileUploadOnCloudinary,
} from "../../../utils/cloudinary";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IUser } from "../user/user.interface";

import { errorLogger } from "../../../shared/logger";
import { IPatient } from "./patient.interface";
import { Patient } from "./patient.model";
import { generatePatientId } from "./patient.utils";
const getAllPatient = async (
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
  const patients = await Patient.find(whereCondition)
    .populate({
      path: "userId",
    })
    .sort()
    .skip(skip)
    .limit(limit);
  const total = await Patient.countDocuments();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: patients,
  };
};
const createPatient = async (
  profile_thumb: string | undefined,
  loggedInUser: IUser | JwtPayload,
  payload: IPatient
) => {
  try {
    const id = await generatePatientId();
    payload.id = id;
    payload.email = loggedInUser.email;

    const patient = await Patient.findOne({ email: loggedInUser.email });
    if (patient) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Patient already exists, please update your profile!"
      );
    }

    // // cloudinary
    if (profile_thumb) {
      const profile = await fileUploadOnCloudinary(profile_thumb);
      if (!profile) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          " profile thumb Failed uploaded!"
        );
      }
      const profileImage = {
        url: profile.secure_url,
        public_id: profile.public_id,
      };

      payload.profile_thumb = profileImage;
    }

    const newPatient = await Patient.create(payload);
    const cratedPatient = Patient.findById(newPatient._id).populate({
      path: "userId",
    });
    if (!createPatient) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Patient  field  his created profile!! "
      );
    }
    return cratedPatient;
  } catch (error) {
    if (profile_thumb) {
      fs.unlinkSync(profile_thumb);
    }

    errorLogger.error("Error creating patient profile:", error);
  }
};
const updatePatient = async (
  profile_thumb: string | undefined,
  id: string,
  payload: IPatient
) => {
  const isExit = await Patient.findOne({ id: id });

  if (!isExit) {
    throw new ApiError(httpStatus.NOT_FOUND, "patient not found!");
  }

  // cloudinary
  if (profile_thumb && isExit?.profile_thumb) {
    await deleteImageOnCloudinary(isExit.profile_thumb.public_id);
  }

  if (profile_thumb) {
    const profile = await fileUploadOnCloudinary(profile_thumb);
    if (!profile) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        " profile thumb Failed uploaded!"
      );
    }
    const profileImage = {
      url: profile.secure_url,
      public_id: profile.public_id,
    };
    payload.profile_thumb = profileImage;
  }

  const patient = await Patient.findOneAndUpdate({ id: id }, payload, {
    new: true,
  });

  return patient;
};
const getSinglePatient = async (payload: string) => {
  const patient = await Patient.findOne({
    $or: [{ email: payload }, { id: payload }],
  }).populate({
    path: "userId",
  });
  if (!patient) {
    throw new ApiError(httpStatus.NOT_FOUND, "patient not exit!!");
  }
  return patient;
};
const deletePatient = async (id: string) => {
  const isExit = await Patient.findOne({ id: id });

  if (!isExit) {
    throw new ApiError(httpStatus.NOT_FOUND, "Patient not found!");
  }
  // delete
  if (isExit?.profile_thumb?.public_id) {
    await deleteImageOnCloudinary(isExit.profile_thumb.public_id);
  }

  const patient = await Patient.deleteOne({ id });

  // Check if the deletion was acknowledged
  if (patient.deletedCount === 0 && patient.acknowledged) {
    throw new Error("Failed to delete user");
  }

  return {
    patient,
    success: true,
  };
};
export const PatientService = {
  getAllPatient,
  updatePatient,
  getSinglePatient,
  deletePatient,
  createPatient,
};
