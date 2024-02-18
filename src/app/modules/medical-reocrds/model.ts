import mongoose, { Schema } from "mongoose";
import { IMedicalRecord } from "./interface";

const medicalRecordsSchema = new mongoose.Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    description: {
      type: String,
      required: true,
    },
    doc: {
      url: { type: String || undefined },
      public_id: { type: String || undefined },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const MedicalRecord = mongoose.model<IMedicalRecord>(
  "MedicalRecord",
  medicalRecordsSchema
);
