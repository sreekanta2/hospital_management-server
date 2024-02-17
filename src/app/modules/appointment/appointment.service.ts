import httpStatus from "http-status";
import ApiError from "../../../utils/ApiError";
import { IAppointment } from "./appointment.interface";
import { Appointment } from "./appointment.model";

const createAppointment = async (
  payload: IAppointment
): Promise<IAppointment> => {
  const updatedAppointment = await Appointment.create(payload);
  const appointment = await Appointment.findById(updatedAppointment._id);
  if (!appointment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Appointment create Failed !");
  }
  return appointment;
};
const updateAppointment = async (
  payload: IAppointment,
  id: string
): Promise<IAppointment | null> => {
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
    throw new ApiError(httpStatus.BAD_REQUEST, "Appointment   updated field !");
  }
  return updatedAppointment;
};
const getSingleAppointment = async (
  id: string
): Promise<IAppointment | null> => {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Appointment  not exit !");
  }

  return appointment;
};
const deleteAppointment = async (id: string) => {
  const appointment = await Appointment.deleteOne({ _id: id });

  if (appointment?.deletedCount === 0 && appointment?.acknowledged) {
    throw new Error("Failed to delete user");
  }

  return appointment;
};
export const AppointmentService = {
  createAppointment,
  updateAppointment,
  getSingleAppointment,
  deleteAppointment,
};
