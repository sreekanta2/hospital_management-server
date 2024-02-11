/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { SortOrder } from "mongoose";
import { searchableFields } from "../../../constant";
import {
  IFilterableFields,
  IPaginationOptions,
} from "../../../interfaces/common";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IDoctor } from "./doctor.interface";
import { Doctor } from "./doctor.model";
const getAllDoctor = async (
  options: IPaginationOptions,
  filter: IFilterableFields
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const { searchTerm, ...filterableData } = filter;
  console.log(filterableData);
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
  const doctor = await Doctor.findOne({
    $or: [{ email: payload }, { id: payload }],
  });
  return doctor;
};
export const DoctorService = {
  getAllDoctor,
  updateDoctor,
  getSingleDoctor,
};
