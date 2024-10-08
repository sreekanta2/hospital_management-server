import mongoose from "mongoose";
import { bloodGroup, gender } from "./constant";
import { IPatient } from "./interface";

export const patientSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      unique: true,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },

    phoneNumber: {
      type: String,
    },
    gender: {
      type: String,
      enum: gender,
    },
    dateOfBirth: {
      type: String,
    },
    avatar: {
      url: { type: String },
      public_id: { type: String },
    },
    bloodGroup: {
      type: String,
      enum: bloodGroup,
    },

    contact: {
      address1: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
      postalCode: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
