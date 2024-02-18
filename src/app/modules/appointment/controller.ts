import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AppointmentService } from "./service";

const createAppointment: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const appointment = await AppointmentService.createAppointment(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment create  successfully",
    data: appointment,
  });
});
const updateAppointment: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const appointment = await AppointmentService.updateAppointment(data, id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Appointment updated  successfully",
    data: appointment,
  });
});
const getSingleAppointment: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await AppointmentService.getSingleAppointment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Single Appointment get  successfully",
    data: appointment,
  });
});
const deleteAppointment: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const appointment = await AppointmentService.deleteAppointment(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  Appointment delete  successfully",
    data: appointment,
  });
});
export const AppointmentController = {
  createAppointment,
  updateAppointment,
  getSingleAppointment,
  deleteAppointment,
};
