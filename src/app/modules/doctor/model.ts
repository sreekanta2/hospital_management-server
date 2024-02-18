import mongoose, { Schema } from "mongoose";
import { IDoctor } from "./interface";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    email: {
      type: String,
      unique: true,
    },
    id: {
      type: String,
      unique: true,
    },
    username: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    description: { type: String },
    rating: { type: Number },
    phoneNumber: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date },
    avatar: {
      url: { type: String || undefined },
      public_id: { type: String || undefined },
    },
    gallery: [
      {
        url: { type: String || undefined },
        public_id: { type: String || undefined },
      },
    ],
    schedule: [
      {
        day: { type: String },
        hours: [
          {
            start: { type: String },
            end: { type: String },
          },
        ],
      },
    ],
    clinicId: {
      type: Schema.Types.ObjectId,
      ref: "Clinic",
    },
    contact: {
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      postalCode: { type: String },
    },
    price: { type: String },
    service: [{ type: String }],
    specializations: { type: String },
    education: [
      {
        degree: { type: String },
        college: { type: String },
        yearOfCompletion: { type: String },
      },
    ],
    experience: [
      {
        hospitalName: { type: String },
        from: { type: Date },
        to: { type: Date },
        designation: { type: String },
      },
    ],
    awards: [
      {
        award: { type: String },
        year: { type: String },
      },
    ],
    registrations: [
      {
        registration: { type: String },
        year: { type: String },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
