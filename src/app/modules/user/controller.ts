import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { UserService } from "./service";

const doctorRegister: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const avatar = req.file?.path;
  const doctor = await UserService.doctorRegister(avatar, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  User register successfully",
    data: doctor,
  });
});
const patientRegister: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const avatar = req.file?.path;
  const doctor = await UserService.patientRegister(avatar, data);
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
const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await UserService.deleteUser(id);
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
  deleteUser,
};
