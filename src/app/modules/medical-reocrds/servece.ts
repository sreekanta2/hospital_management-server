import fs from "fs";
import httpStatus from "http-status";
import mongoose, { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/common";
import ApiError from "../../../utils/ApiError";
import {
  deleteImageOnCloudinary,
  fileUploadOnCloudinary,
} from "../../../utils/cloudinary";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IMedicalRecord } from "./interface";
import { MedicalRecord } from "./model";

const createMedicalRecord = async (
  payload: IMedicalRecord,
  docLocalPath: string | undefined
) => {
  // cloudinary uploaded file
  try {
    if (docLocalPath) {
      const profile = await fileUploadOnCloudinary(docLocalPath);
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

      payload.doc = profileImage;
    }

    const medicalRecord = await MedicalRecord.create(payload);
    if (!medicalRecord) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Medical record create field !"
      );
    }
    return medicalRecord;
  } catch (error) {
    if (docLocalPath) {
      fs.unlinkSync(docLocalPath);
    }
  }
};
const updateMedicalRecord = async (
  docLocalPath: string | undefined,
  id: string,
  payload: IMedicalRecord
) => {
  const isExit = await MedicalRecord.findById(id);

  if (!isExit) {
    throw new ApiError(httpStatus.NOT_FOUND, "MedicalRecord not found!");
  }

  // cloudinary
  if (docLocalPath && isExit?.doc) {
    await deleteImageOnCloudinary(isExit.doc.public_id);
  }

  if (docLocalPath) {
    const profile = await fileUploadOnCloudinary(docLocalPath);
    if (!profile) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Document Failed uploaded!");
    }
    const profileImage = {
      url: profile.secure_url,
      public_id: profile.public_id,
    };
    payload.doc = profileImage;
  }

  const medicalRecord = await MedicalRecord.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return medicalRecord;
};
const getPatientAllMedicalRecords = async (
  id: string,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const conditionalSorting: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    conditionalSorting[sortBy] = sortOrder;
  }
  const prescription = await MedicalRecord.find({
    patient: new mongoose.Types.ObjectId(id),
  })
    .populate({ path: "doctor" })
    .sort(conditionalSorting)
    .skip(skip)
    .limit(limit);
  const total = await MedicalRecord.countDocuments({
    patient: new mongoose.Types.ObjectId(id),
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: prescription,
  };
};
export const MedicalRecordService = {
  createMedicalRecord,
  updateMedicalRecord,
  getPatientAllMedicalRecords,
};
