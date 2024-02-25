import fs from "fs";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import { singleFileUploaded } from "../../../utils/cloudinary";
import { Doctor } from "../doctor/model";
import { Patient } from "../patient/model";
import { IUser } from "./interface";
import { User } from "./model";
import { generateDoctorId, generatePatientId } from "./utils";

const doctorRegister = async (
  avatarLocalPath: string | undefined,
  payload: IUser
) => {
  let newUserAllData = null;
  try {
    // user checking on database
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        " user already Exit please update your profile!"
      );
    }
    // checking role base user and incrise doctor id
    const id = await generateDoctorId();
    // file uploaded on cloudinary
    if (avatarLocalPath) {
      const savedAvatar = await singleFileUploaded(avatarLocalPath);

      if (!savedAvatar) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "avatarLocalPath  uploaded  field!"
        );
      }
      payload.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    }
    // transition for user and doctor create (user and doctor  create at a same time  and same data)
    const session = await mongoose.startSession();

    session.startTransaction();

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

    if (newUserAllData) {
      newUserAllData = await User.findOne({
        email: newUserAllData.email,
      });
    }

    if (!newUserAllData) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User   crated Field!");
    }
    return newUserAllData;
  } catch (error) {
    // if (avatarLocalPath) {
    //   fs.unlinkSync(avatarLocalPath);
    // }
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const patientRegister = async (
  avatarLocalPath: string | undefined,
  payload: IUser
) => {
  let newUserAllData = null;
  try {
    // user checking on database
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        " user already Exit please update your profile!"
      );
    }
    // checking role base user   and incrise patient id
    const id = await generatePatientId();
    // file uploaded on cloudinary
    if (avatarLocalPath) {
      const savedAvatar = await singleFileUploaded(avatarLocalPath);

      if (!savedAvatar) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "avatarLocalPath  uploaded  field!"
        );
      }
      payload.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    }
    // transition for user and patient create (user and patient  create at a same time  and same data)
    const session = await mongoose.startSession();

    session.startTransaction();

    payload.role = "patient";
    payload.id = id;

    const newPatient = await Patient.create([payload], {
      session,
    });

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

    if (newUserAllData) {
      newUserAllData = await User.findOne({
        email: newUserAllData.email,
      });
    }

    if (!newUserAllData) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User   crated Field!");
    }
    return newUserAllData;
  } catch (error) {
    if (avatarLocalPath) {
      fs.unlinkSync(avatarLocalPath);
    }
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

const getSingleUser = async (id: string): Promise<IUser> => {
  const user = await User.findById({
    _id: id,
  })
    // dynamically populate Patient or doctor field
    .populate({
      path: "patientId",
    })
    .populate({
      path: "doctorId",
    })
    .select("-password");
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User  not exits!");
  }

  return user;
};
const deleteUser = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(id).session(session);

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // Delete user and related entities in a transaction
    const [deleteUser, deleteDoctorOrPatient] = await Promise.all([
      User.deleteOne({ id: user.id }).session(session),
      user.role === "doctor"
        ? Doctor.deleteOne({ id: user.id }).session(session)
        : user.role === "patient"
          ? Patient.deleteOne({ id: user.id }).session(session)
          : null,
    ]);
    if (
      !deleteUser.acknowledged === true &&
      !deleteDoctorOrPatient?.acknowledged === true
    ) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "user and patient or doctor deleted field"
      );
    }

    await session.commitTransaction();
    session.endSession();

    return { deleteUser, deleteDoctorOrPatient };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Error deleting user: ${error}`
    );
  }
};

export const UserService = {
  patientRegister,
  doctorRegister,
  getSingleUser,
  deleteUser,
};
