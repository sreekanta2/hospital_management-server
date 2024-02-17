import { Schema, model } from "mongoose";
import { IReview } from "./interface";

const reviewSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    description: {
      type: String,
    },

    rating: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const Review = model<IReview>("Review", reviewSchema);
