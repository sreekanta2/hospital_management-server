import { Schema, model } from "mongoose";
import { IAppointment } from "./appointment.interface";

const appointmentSchema = new Schema(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
    },
    status: {
      type: Boolean,
    },
    confirmDate: {
      type: String,
    },
    amount: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);
export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
