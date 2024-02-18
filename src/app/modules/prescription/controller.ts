import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { PrescriptionService } from "./servce";

const createPrescription: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const prescription = await PrescriptionService.createPrescription(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Patient  profile crated successfully",
    data: prescription || null,
  });
});
const updatePrescription: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const prescription = await PrescriptionService.updatePrescription(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Prescription updated successfully",
    data: prescription || null,
  });
});
const getPatientAllPrescription: RequestHandler = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    const paginationOptions = req.query;
    const prescription = await PrescriptionService.getPatientAllPrescription(
      id,
      paginationOptions
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Retrieve all Prescriptions  successfully",
      data: prescription || null,
    });
  }
);
const deletePrescription: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const prescription = await PrescriptionService.deletePrescription(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  Review delete  successfully",
    data: prescription,
  });
});
export const PrescriptionController = {
  createPrescription,
  updatePrescription,
  getPatientAllPrescription,
  deletePrescription,
};
