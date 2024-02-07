import httpStatus from "http-status";
import { User } from "../app/modules/user/user.model";
import ApiError from "./ApiError";

export const accessTokenAndRefreshTokenGenerate = async (userId: string) => {
  const user = await User.findOne({ id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user doesn't exit!!");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
