import fs from "fs";
import httpStatus from "http-status";
import ApiError from "../../../utils/ApiError";

import { JwtPayload } from "jsonwebtoken";
import mongoose, { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/common";
import { errorLogger } from "../../../shared/logger";
import {
  singleFileDelete,
  singleFileUpdated,
  singleFileUploaded,
} from "../../../utils/cloudinary";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IMedicalRecord } from "./interface";
import { MedicalRecord } from "./model";

const createMedicalRecord = async (
  user: JwtPayload,
  payload: IMedicalRecord,
  docLocalPath: string | undefined
) => {
  payload.patient = user._id;

  try {
    if (docLocalPath) {
      const savedDoc = await singleFileUploaded(docLocalPath);

      if (!savedDoc) {
        throw new ApiError(httpStatus.BAD_REQUEST, "doc  uploaded  field!");
      }
      payload.doc = {
        url: savedDoc?.secure_url,
        public_id: savedDoc.public_id,
      };
    }
    const medicalRecord = await MedicalRecord.create(payload);
    if (!medicalRecord) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        " Medical record create field!"
      );
    }
    return medicalRecord;
  } catch (error) {
    if (docLocalPath) {
      fs.unlinkSync(docLocalPath);
    }
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const updateMedicalRecord = async (
  docLocalPath: string | undefined,
  id: string,
  payload: IMedicalRecord
) => {
  try {
    const exitingDoc = await MedicalRecord.findById(id);
    if (!exitingDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "MedicalRecord not found!");
    }

    // cloudinary
    let savedDoc;
    if (docLocalPath && exitingDoc.doc.public_id) {
      savedDoc = await singleFileUpdated(
        docLocalPath,
        exitingDoc.doc.public_id
      );
      if (!savedDoc) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "medical   updated failed !"
        );
      }
    } else if (docLocalPath) {
      savedDoc = await singleFileUploaded(docLocalPath);
      if (!savedDoc) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "medical   updated failed !"
        );
      }
    }
    exitingDoc.set({
      ...payload,
      doc: {
        url: savedDoc?.secure_url,
        public_id: savedDoc?.public_id,
      },
    });
    const medicalRecord = await exitingDoc.save();
    return medicalRecord;
  } catch (error) {
    if (docLocalPath) {
      fs.unlinkSync(docLocalPath);
    }
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
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
    .populate({
      path: "doctor",
      select: ["firstName", "avatar", "id", "lastName"],
    })
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
const deleteMedicalRecord = async (id: string) => {
  try {
    const exitingDoc = await MedicalRecord.findById(id);

    if (!exitingDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "MedicalRecord not found!");
    }
    // delete
    if (exitingDoc?.doc?.public_id) {
      await singleFileDelete(exitingDoc.doc.public_id);
    }

    const medicalRecord = await MedicalRecord.deleteOne({ _id: id });

    // Check if the deletion was acknowledged
    if (medicalRecord.deletedCount === 0 && medicalRecord.acknowledged) {
      throw new Error("Failed to delete medical record");
    }

    return {
      medicalRecord,
      success: true,
    };
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
export const MedicalRecordService = {
  createMedicalRecord,
  updateMedicalRecord,
  getPatientAllMedicalRecords,
  deleteMedicalRecord,
};
