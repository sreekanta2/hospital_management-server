import httpStatus from "http-status";
import ApiError from "../../../utils/ApiError";
import { IUser } from "./interface";
import { User } from "./model";

const doctorRegister = async (payload: IUser): Promise<IUser> => {
  const isUserExit = await User.findOne({ email: payload.email });

  if (isUserExit) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User  already exits!");
  }
  payload.role = "doctor";
  const user = await User.create(payload);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User create field!");
  }
  return user;
};
const patientRegister = async (payload: IUser): Promise<IUser> => {
  const isUserExit = await User.findOne({ email: payload.email });
  if (isUserExit) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User  already exits!");
  }
  payload.role = "patient";
  const user = await User.create(payload);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User create field!");
  }

  return user;
};
const getSingleUser = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User  already exits!");
  }

  return user;
};

export const UserService = {
  patientRegister,
  doctorRegister,
  getSingleUser,
};
