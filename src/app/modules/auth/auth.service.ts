import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../utils/ApiError";
import { accessTokenAndRefreshTokenGenerate } from "../../../utils/generateAccessRefreshToken";
import { User } from "../user/user.model";
import { IChangePassword, ILogin, ILoginResponse } from "./auth.interface";

const login = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exit!!");
  }
  const isMatched = await user.checkPassword(password);
  if (!isMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  const { accessToken, refreshToken } =
    await accessTokenAndRefreshTokenGenerate(user.id);

  return { accessToken, refreshToken };
};
const logout = async (payload: JwtPayload) => {
  try {
    const result = await User.findOneAndUpdate(
      payload,
      {
        $set: {
          refreshToken: "",
        },
      },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "some thing went wrong tray again!"
    );
  }
};
const changePassword = async (
  payload: string,
  passwordData: IChangePassword
) => {
  const { oldPassword, newPassword } = passwordData;

  if (oldPassword === newPassword) {
    throw new Error("old and new password are same!");
  }

  const hashNewPassword = await bcrypt.hash(
    newPassword,
    Number(process.env.BCRYPT_SOL)
  );

  const user = await User.findOne({
    $or: [{ email: payload }, { id: payload }],
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exit!!");
  }

  const verifiedUser = await user.checkPassword(oldPassword);
  if (!verifiedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "old password incorrect!!");
  }

  const result = await User.findOneAndUpdate(
    { $or: [{ email: payload }, { id: payload }] },
    {
      $set: {
        password: hashNewPassword,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  return result;
};

export const AuthService = { login, logout, changePassword };
