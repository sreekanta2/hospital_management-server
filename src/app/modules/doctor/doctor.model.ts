import mongoose, { Schema } from "mongoose";
import { IUser } from "../user/user.interface";

const scheduleSchema = new mongoose.Schema({
  day: String,
  hours: [
    {
      start: String,
      end: String,
    },
  ],
});

const clinicSchema = new mongoose.Schema({
  name: String,
  address: String,
  image: [
    {
      url1: String,
      url2: String,
    },
  ],
});

const contactSchema = new mongoose.Schema({
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
});

export const doctorSchemaT = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    username: {
      type: String,
      unique: true,
    },
    firstName: String,
    lastName: String,
    rating: Number,
    phoneNumber: {
      type: String,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: String,
    profile_thumb: String,

    gallery: [
      {
        imageUrl: String,
      },
    ],
    schedule: [scheduleSchema],
    clinic: [clinicSchema],
    contact: [contactSchema],
    price: String,
    service: [String],
    Specializations: [String],
    education: [
      {
        degree: String,
        college: String,
        yearOfCompletion: String,
      },
    ],
    experience: [
      {
        hospitalName: String,
        from: String,
        to: String,
        designation: String,
      },
    ],
    awards: [
      {
        award: String,
        year: String,
      },
    ],
    registrations: [
      {
        registration: String,
        year: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const doctorSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
    unique: true,
  },
});

export const Doctor = mongoose.model<Pick<IUser, "id" | "email">>(
  "Doctor",
  doctorSchema
);
