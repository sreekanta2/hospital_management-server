import { RequestHandler } from "express";
import httpStatus from "http-status";
import { searchableFields } from "../../../constant";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import pick from "../../../utils/pick";
import { PatientService } from "./service";

const getAllPatient: RequestHandler = asyncHandler(async (req, res) => {
  const paginationOptions = req.query;

  const filter = pick(req.query, searchableFields);

  const patient = await PatientService.getAllPatient(paginationOptions, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " patient all get successfully  ",
    data: patient,
  });
});

const updatePatient: RequestHandler = asyncHandler(async (req, res) => {
  const avatar = req.file?.path;

  const data = req.body;
  const { id } = req.params;
  const user = req.user;
  const patient = await PatientService.updatePatient(avatar, id, data, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Patient successfully profile update",
    data: patient || null,
  });
});

export const PatientController = {
  getAllPatient,
  updatePatient,
};
