import httpStatus from "http-status";
import mongoose from "mongoose";
import ApiError from "../../../utils/ApiError";
import { Doctor } from "../doctor/model";
import { Patient } from "../patient/model";
import { IUser } from "./interface";
import { User } from "./model";
import { generateDoctorId, generatePatientId } from "./utils";

const doctorRegister = async (payload: IUser): Promise<IUser> => {
  let newUserAllData = null;
  try {
    const session = await mongoose.startSession();

    session.startTransaction();
    const id = await generateDoctorId();

    payload.role = "doctor";
    payload.id = id;

    const newDoctor = await Doctor.create([payload], { session });

    if (!newDoctor.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    payload.doctorId = newDoctor[0]._id;

    const newUser = await User.create([payload], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${error}`);
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({
      email: newUserAllData.email,
    })
      .populate("doctorId")
      .select("-password");
  }

  if (!newUserAllData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User   crated Field!");
  }
  return newUserAllData;
};
const patientRegister = async (payload: IUser) => {
  const id = await generatePatientId();
  payload.role = "patient";

  let newUserAllData = null;
  try {
    const isUserExit = await User.findOne({ email: payload.email });

    if (isUserExit) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User  already exits!");
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    payload.id = id;

    const newPatient = await Patient.create([payload], { session });

    if (!newPatient.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create patient");
    }

    payload.patientId = newPatient[0]._id;

    const newUser = await User.create([payload], { session });

    if (!newUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
    }
    newUserAllData = newUser[0];

    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    console.log(error);
  }
  if (newUserAllData) {
    newUserAllData = await User.findOne({
      email: newUserAllData.email,
    }).select("-password");
  }
  if (!newUserAllData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User   crated Field!");
  }
  return newUserAllData;
};

const getSingleUser = async (id: string): Promise<IUser> => {
  const user = await User.findById({
    _id: id,
  })
    .populate("patientId")
    .populate({
      path: "doctorId",
      select: ["firstName", "lastName", "id", "-_id"], // Add the fields you want to select
    })
    .select("-password");
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User  not exits!");
  }

  return user;
};

export const UserService = {
  patientRegister,
  doctorRegister,
  getSingleUser,
};
