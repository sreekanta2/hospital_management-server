import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { DoctorService } from "./doctor.service";

const createDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const doctor = await DoctorService.createDoctor(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "   User register successfully",
    data: doctor,
  });
});
const getSingleDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await DoctorService.getSingleDoctor(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  get single user User  successfully",
    data: doctor,
  });
});
export const DoctorController = {
  createDoctor,
  getSingleDoctor,
};
