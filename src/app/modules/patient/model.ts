import mongoose, { Schema } from "mongoose";
import { bloodGroup, gender } from "./constant";
import { IPatient } from "./interface";

export const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
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
    profile_thumb: {
      url: { type: String || undefined },
      public_id: { type: String || undefined },
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
export const Patient = mongoose.model<IPatient>("patient", patientSchema);
