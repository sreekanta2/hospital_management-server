import httpStatus from "http-status";
import { errorLogger } from "../../../shared/logger";
import ApiError from "../../../utils/ApiError";
import { IReview } from "./interface";
import { Review } from "./model";

const createReview = async (payload: IReview): Promise<IReview> => {
  try {
    const review = await Review.create(payload);
    const createReview = await Review.findById(review._id);
    if (!createReview) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Review create field!");
    }
    return createReview;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
const updateReview = async (id: string, payload: IReview): Promise<IReview> => {
  try {
    const updatedReview = await Review.findOneAndUpdate({ _id: id }, payload, {
      new: true,
    });
    if (!updatedReview) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Review updated field!");
    }
    return updatedReview;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

const getSingeReview = async (id: string): Promise<IReview> => {
  try {
    const singleReview = await Review.findById({ _id: id });
    if (!singleReview) {
      throw new ApiError(httpStatus.BAD_REQUEST, " retrieve Review field!");
    }
    return singleReview;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};

const deleteReview = async (id: string) => {
  try {
    const review = await Review.deleteOne({ _id: id });

    if (review?.deletedCount === 0 && review?.acknowledged) {
      throw new Error("Failed to delete review");
    }
    return review;
  } catch (error) {
    errorLogger.error(error);
    throw new Error(`${error}`);
  }
};
export const ReviewService = {
  createReview,
  updateReview,
  getSingeReview,
  deleteReview,
};
