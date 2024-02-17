import { RequestHandler } from "express";
import httpStatus from "http-status";
import { sendResponse } from "../../../shared/sendResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ReviewService } from "./service";

const createReview: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const review = await ReviewService.createReview(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review created   successfully",
    data: review,
  });
});
const updatedReview: RequestHandler = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id } = req.params;
  const review = await ReviewService.updateReview(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Review updated   successfully",
    data: review,
  });
});
const getSingleReview: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const review = await ReviewService.getSingeReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: " Retrieve single review    successfully",
    data: review,
  });
});
const deleteReview: RequestHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedReview = await ReviewService.deleteReview(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "  Review delete  successfully",
    data: deletedReview,
  });
});
export const ReviewController = {
  createReview,
  updatedReview,
  getSingleReview,
  deleteReview,
};
