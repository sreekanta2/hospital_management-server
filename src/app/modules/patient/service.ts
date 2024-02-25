import fs from "fs";
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import ApiError from "../../../utils/ApiError";
import {
  singleFileUpdated,
  singleFileUploaded,
} from "../../../utils/cloudinary";
import { paginationCalculator } from "../../../utils/paginationHelper";

import { JwtPayload } from "jsonwebtoken";
import { errorLogger } from "../../../shared/logger";
import { User } from "../user/model";
import { IPatient } from "./interface";
import { Patient } from "./model";

const updatePatient = async (
  avatarLocalPath: string | undefined,
  id: string,
  payload: IPatient,
  user: JwtPayload
) => {
  try {
    const [exitingUser, exitingPatient] = await Promise.all([
      User.findOne({ email: user.email }),
      Patient.findById(id),
    ]);

    if (!exitingPatient || !exitingUser) {
      throw new ApiError(httpStatus.NOT_FOUND, "user and patient not found!");
    }

    // cloudinary

    if (avatarLocalPath && exitingPatient.avatar?.public_id) {
      const savedAvatar = await singleFileUpdated(
        avatarLocalPath,
        exitingPatient.avatar.public_id
      );

      if (!savedAvatar) {
        throw new ApiError(httpStatus.BAD_REQUEST, "avatar  update  field!");
      }
      exitingPatient.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
      exitingUser.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    } else if (avatarLocalPath) {
      const savedAvatar = await singleFileUploaded(avatarLocalPath);
      if (!savedAvatar) {
        throw new ApiError(httpStatus.BAD_REQUEST, "avatar  uploaded field!");
      }
      exitingPatient.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
      exitingUser.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    }
    exitingPatient.set({
      ...payload,
      avatar: {
        url: exitingPatient?.avatar?.url,
        public_id: exitingPatient?.avatar?.public_id,
      },
    });
    exitingPatient.set({
      ...payload,
      avatar: {
        url: exitingPatient?.avatar?.url,
        public_id: exitingPatient?.avatar?.public_id,
      },
    });
    const updatePatient = Promise.all([
      exitingPatient.save(),
      exitingUser.save(),
    ]);
    return updatePatient;
  } catch (error) {
    if (avatarLocalPath) {
      fs.unlinkSync(avatarLocalPath);
    }
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
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
  try {
    const patients = await Patient.find(whereCondition)

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
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

export const PatientService = {
  getAllPatient,
  updatePatient,
};
