import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { SortOrder } from "mongoose";
import { IPaginationOptions } from "../../../interfaces/common";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import { paginationCalculator } from "../../../utils/paginationHelper";
import { IAppointment } from "./interface";
import { Appointment } from "./model";

const createAppointment = async (
  user: JwtPayload,
  payload: IAppointment
): Promise<IAppointment> => {
  payload.patientId = user._id;
  try {
    const updatedAppointment = await Appointment.create(payload);
    const appointment = await Appointment.findById(updatedAppointment._id);
    if (!appointment) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Appointment create Failed !");
    }
    return appointment;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const updateAppointment = async (
  payload: IAppointment,
  id: string
): Promise<IAppointment | null> => {
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Appointment  not exit !");
    }
    const updatedAppointment = Appointment.findByIdAndUpdate(
      { _id: id },
      payload,
      { new: true }
    );
    if (!updatedAppointment) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Appointment   updated field !"
      );
    }
    return updatedAppointment;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const getAllAppointment = async (
  user: JwtPayload,
  options: IPaginationOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationCalculator(options);
  const conditionalSorting: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    conditionalSorting[sortBy] = sortOrder;
  }
  try {
    const appointments = await Appointment.find({
      $or: [{ patientId: user._id }, { doctorId: user._id }],
    })
      .sort()
      .skip(skip)
      .limit(limit);

    const total = await Appointment.countDocuments({
      $or: [{ patientId: user._id }, { doctorId: user._id }],
    });
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: appointments,
    };
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const getSingleAppointment = async (
  id: string
): Promise<IAppointment | null> => {
  try {
    const appointment = await Appointment.findById(id);
    if (!appointment) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Appointment  not exit !");
    }

    return appointment;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const deleteAppointment = async (id: string) => {
  try {
    const appointment = await Appointment.deleteOne({ _id: id });

    if (appointment?.deletedCount === 0 && appointment?.acknowledged) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to delete user");
    }

    return appointment;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
export const AppointmentService = {
  createAppointment,
  updateAppointment,
  getAllAppointment,
  getSingleAppointment,
  deleteAppointment,
};
