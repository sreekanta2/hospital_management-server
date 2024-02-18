import httpStatus from "http-status";
import { User } from "../app/modules/user/model";
import ApiError from "./ApiError";

export const accessTokenAndRefreshTokenGenerate = async (payload: string) => {
  const user = await User.findOne({
    $or: [{ id: payload }, { email: payload }],
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user doesn't exit!!");
  }

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
