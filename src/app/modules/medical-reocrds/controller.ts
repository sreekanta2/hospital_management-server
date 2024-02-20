import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { MedicalRecordService } from "./service";

const createMedicalRecord: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const doc = req.file?.path;
  const user = req.user;
  const medicalRecords = await MedicalRecordService.createMedicalRecord(
    user,
    data,
    doc
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " patient all get successfully  ",
    data: medicalRecords,
  });
});
const updateMedicalRecord: RequestHandler = asyncHandler(async (req, res) => {
  const docLocalPath = req.file?.path;

  const data = req.body;
  const { id } = req.params;

  const patient = await MedicalRecordService.updateMedicalRecord(
    docLocalPath,
    id,
    data
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Patient successfully profile update",
    data: patient || null,
  });
});
const getPatientAllMedicalRecords: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const paginationOptions = req.query;
    const medicalRecord =
      await MedicalRecordService.getPatientAllMedicalRecords(
        id,
        paginationOptions
      );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retrieve all medical records  successfully",
      data: medicalRecord || null,
    });
  }
);
const deleteMedicalRecord: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const medicalRecord = await MedicalRecordService.deleteMedicalRecord(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Delete medical records  successfully",
    data: medicalRecord || null,
  });
});
export const MedicalRecordController = {
  createMedicalRecord,
  updateMedicalRecord,
  getPatientAllMedicalRecords,
  deleteMedicalRecord,
};
