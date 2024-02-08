import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { UserService } from "./user.service";

const registerDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const doctor = await UserService.registerDoctor(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "   Doctor register successfully",
    data: doctor,
  });
});
const registerPatient: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const patient = await UserService.registerPatient(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "   Patient register successfully",
    data: patient,
  });
});

export const UserController = {
  registerDoctor,
  registerPatient
};
