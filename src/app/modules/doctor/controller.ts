import { RequestHandler } from "express";
import httpStatus from "http-status";
import { searchableFields } from "../../../constant";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import pick from "../../../utils/pick";
import { DoctorService } from "./service";

const updateDoctor: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.files || !("avatar" in req.files) || !("gallery" in req.files)) {
    return res.status(400).send("Invalid request: Missing file properties");
  }
  const avatar = req.files["avatar"] as Express.Multer.File[];
  const gallery = req.files["gallery"] as Express.Multer.File[];
  const data = req.body;

  const { id } = req.params;

  const doctor = await DoctorService.updateDoctor(
    avatar[0].path,
    gallery,
    data,
    id
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Doctor successfully profile update",
    data: doctor,
  });
});
const getAllDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const paginationOptions = req.query;

  const filter = pick(req.query, searchableFields);

  const doctor = await DoctorService.getAllDoctor(paginationOptions, filter);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Doctor all get successfully  ",
    data: doctor,
  });
});

const getSingleDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const doctor = await DoctorService.getSingleDoctor(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  get single user User  successfully",
    data: doctor,
  });
});
const deleteDoctor: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const doctor = await DoctorService.deleteDoctor(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "doctor delete  successfully",
    data: doctor,
  });
});
export const DoctorController = {
  getAllDoctor,
  updateDoctor,
  getSingleDoctor,
  deleteDoctor,
};
