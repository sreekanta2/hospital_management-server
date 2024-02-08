import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
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
export const Patient = mongoose.model("patient", patientSchema);
