import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import ApiError from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { UserService } from "./user.service";

const createDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const result = await UserService.createDoctor(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor create successfully",
    data: result,
  });
});
const login: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;

  const result = await UserService.login(data);
  const options = {
    httpOnly: true,
    secure: true,
  };

  const { accessToken, refreshToken } = result;
  sendResponse(
    res
      .cookie("accessToken ", accessToken, options)
      .cookie("refreshToken", refreshToken, options),
    {
      statusCode: httpStatus.OK,
      success: true,
      message: "user Login  successfully",
      data: result,
    }
  );
});
const logoutUser = asyncHandler(async (req, res) => {
  const data = req.user;
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User UNAUTHORIZED");
  }
  const result = await UserService.logoutUser(data);
  const options = {
    httpOnly: true,
    secure: true,
  };
  sendResponse(
    res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options),
    {
      statusCode: httpStatus.OK,
      success: true,
      message: "user Login  successfully",
      data: result,
    }
  );
});
export const UserController = {
  createDoctor,
  login,
  logoutUser,
};
