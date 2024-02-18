import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { UserService } from "./service";

const doctorRegister: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const doctor = await UserService.doctorRegister(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  User register successfully",
    data: doctor,
  });
});
const patientRegister: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const doctor = await UserService.patientRegister(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  User register successfully",
    data: doctor,
  });
});
const getSingleUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await UserService.getSingleUser(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  User register successfully",
    data: doctor,
  });
});

export const UserController = {
  doctorRegister,
  patientRegister,
  getSingleUser,
};
