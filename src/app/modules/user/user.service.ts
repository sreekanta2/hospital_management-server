import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../utils/ApiError";
import { accessTokenAndRefreshTokenGenerate } from "../../../utils/generateAccessRefreshToken";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import { generateDoctorId } from "./user.utils";

const createDoctor = async (user: IUser) => {
  const id = await generateDoctorId();
  user.id = id;
  const { email, password, role } = user;

  if ([id, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(httpStatus.FORBIDDEN, "All fields are required");
  }

  const doctor = await User.create(user);
  const createDoctor = await User.findOne({ id: doctor.id }).select(
    "-password -refreshToken"
  );
  if (!createDoctor) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Something went wrong!");
  }
  return createDoctor;
};

const login = async (payload: { email: string; password: string }) => {
  // req body -> data
  // username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, password } = payload;

  const user = await User.isUserExit(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exit!!");
  }
  const isMatched = await User.checkPassword(password, user.password);
  if (!isMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  const { accessToken, refreshToken } =
    await accessTokenAndRefreshTokenGenerate(user.id);

  return { accessToken, refreshToken };
};
const logoutUser = async (payload: JwtPayload) => {
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
    throw new ApiError(httpStatus.UNAUTHORIZED, "some thing went wrong!");
  }
};

export const UserService = {
  createDoctor,
  login,
  logoutUser,
};
