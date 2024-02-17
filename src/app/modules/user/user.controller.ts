import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { UserService } from "./user.service";

const register: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const doctor = await UserService.register(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  User register successfully",
    data: doctor,
  });
});

export const UserController = {
  register,
};
