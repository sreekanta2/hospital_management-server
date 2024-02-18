import mongoose, { Schema } from "mongoose";
import { IPrescription } from "./interface";

const prescriptionSchema = new mongoose.Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    medicines: [
      {
        name: { type: String, required: true },
        qty: { type: Number, default: 1 },
        morning: { type: Boolean, default: false },
        evening: { type: Boolean, default: false },
        night: { type: Boolean, default: false },
        weight: { type: Number, required: true },
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
export const Prescription = mongoose.model<IPrescription>(
  "Prescription",
  prescriptionSchema
);
