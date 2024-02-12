/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import mongoose, { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { User } from "../user/user.model";
import { IDoctor } from "./doctor.interface";
import { Doctor } from "./doctor.model";
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
const updateDoctor = async (id: string, payload: IDoctor) => {
  if (payload.phoneNumber) {
    const phoneNumberExists = await Doctor.findOne({
      phoneNumber: payload.phoneNumber,
      email: { $ne: id },
    });
    if (phoneNumberExists) {
      throw new ApiError(403, "Phone number already exit !!");
    }
  }

  const isExit = await Doctor.findOne({ id });

  if (!isExit) {
    throw new ApiError(httpStatus.NOT_FOUND, "doctor not found!");
  }
  const doctor = await Doctor.findOneAndUpdate({ id: id }, payload, {
    new: true,
  });

  return doctor;
};
const getSingleDoctor = async (payload: string) => {
  const doctor = await User.findOne({
    $or: [{ email: payload }, { id: payload }],
  }).populate({
    path: "doctor",
  });
  return doctor;
};
const deleteDoctor = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    // Start a transaction
    session.startTransaction();

    // Delete student using session
    const doctor = await Doctor.deleteOne({ id }, { session });

    // Check if the deletion was acknowledged
    if (doctor.deletedCount === 0 && doctor.acknowledged) {
      throw new Error("Failed to delete user");
    }

    // Delete user using session

    const deleteUser = await User.deleteOne({ id }, { session });

    // Check if the deletion was acknowledged
    if (deleteUser.acknowledged && deleteUser.deletedCount === 0) {
      throw new Error("Failed to delete user");
    }

    // Commit the transaction if both deletions are successful
    await session.commitTransaction();
    await session.endSession();

    return {
      doctor,
      deleteUser,
      success: true,
    };
  } catch (error) {
    // If an error occurs during the transaction, catch it and abort the transaction
    await session.abortTransaction();
    throw new ApiError(httpStatus.BAD_REQUEST, "Doctor and user delete field");
  }
};
export const DoctorService = {
  getAllDoctor,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
};
