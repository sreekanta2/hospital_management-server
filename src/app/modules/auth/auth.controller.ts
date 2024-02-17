import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import ApiError from "../../../utils/ApiError";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthService } from "./auth.service";

const login: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const result = await AuthService.login(data);
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
const logout = asyncHandler(async (req, res) => {
  const data = req.user;
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User UNAUTHORIZED");
  }
  const result = await AuthService.logout(data);
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
      message: "user Logout  successfully",
      data: result,
    }
  );
});
const changePassword = asyncHandler(async (req, res) => {
  const data = req.user;
  const passwordData = req.body;
  if (!data) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "User UNAUTHORIZED");
  }
  const result = await AuthService.changePassword(data.id, passwordData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change successfully",
    data: result,
  });
});

const forgatPassword = asyncHandler(async (req, res) => {
  const email = req.body;
  const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password`;
  const result = await AuthService.forgatPassword(resetUrl, email.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change successfully",
    data: result,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, confirmPassword } = req.body;
  const token = req.params.token;
  const result = await AuthService.resetPassword(
    token,
    password,
    confirmPassword
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password change successfully",
    data: result,
  });
});
export const AuthController = {
  login,
  logout,
  changePassword,
  forgatPassword,
  resetPassword,
};
