import httpStatus from "http-status";
import mongoose, { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/common";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IPrescription, Medicine } from "./interface";
import { Prescription } from "./model";

const createPrescription = async (
  payload: IPrescription
): Promise<IPrescription> => {
  try {
    const existingPrescription = await Prescription.aggregate([
      {
        $match: {
          patient: new mongoose.Types.ObjectId(payload.patient),
          doctor: new mongoose.Types.ObjectId(payload.doctor),
        },
      },
      {
        $limit: 1,
      },
    ]);

    if (existingPrescription.length > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Prescription  already created  please update prescription for  this prescription !"
      );
    }
    const prescription = await Prescription.create(payload);

    if (!prescription) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Prescription create field !");
    }
    return prescription;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const updatePrescription = async (
  prescriptionId: string,
  updatedMedicines: Medicine[]
) => {
  try {
    const newPrescription = await Prescription.findByIdAndUpdate(
      { _id: prescriptionId },
      {
        $set: {
          medicines: updatedMedicines,
        },
      },
      { new: true }
    );
    return newPrescription;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const getPatientAllPrescription = async (
  id: string,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const conditionalSorting: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    conditionalSorting[sortBy] = sortOrder;
  }
  try {
    const prescription = await Prescription.find({
      patient: new mongoose.Types.ObjectId(id),
    })
      .sort(conditionalSorting)
      .skip(skip)
      .limit(limit);
    const total = await Prescription.countDocuments({
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
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const deletePrescription = async (id: string) => {
  try {
    const prescription = await Prescription.deleteOne({ _id: id });

    if (prescription?.deletedCount === 0 && prescription?.acknowledged) {
      throw new Error("Failed to delete prescription");
    }

    return prescription;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
export const PrescriptionService = {
  createPrescription,
  updatePrescription,
  getPatientAllPrescription,
  deletePrescription,
};
