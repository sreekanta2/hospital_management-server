import httpStatus from "http-status";
import ApiError from "../../../utils/ApiError";
import { IReview } from "./interface";
import { Review } from "./model";

const createReview = async (payload: IReview): Promise<IReview> => {
  const review = await Review.create(payload);
  const createReview = await Review.findById(review._id);
  if (!createReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Review create field!");
  }
  return createReview;
};
const updateReview = async (id: string, payload: IReview): Promise<IReview> => {
  const updatedReview = await Review.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!updatedReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Review updated field!");
  }
  return updatedReview;
};
const getSingeReview = async (id: string): Promise<IReview> => {
  const singleReview = await Review.findById({ _id: id });
  if (!singleReview) {
    throw new ApiError(httpStatus.BAD_REQUEST, " retrieve Review field!");
  }
  return singleReview;
};

const deleteReview = async (id: string) => {
  const review = await Review.deleteOne({ _id: id });

  if (review?.deletedCount === 0 && review?.acknowledged) {
    throw new Error("Failed to delete review");
  }

  return review;
};
export const ReviewService = {
  createReview,
  updateReview,
  getSingeReview,
  deleteReview,
};
