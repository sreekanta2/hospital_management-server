import { IDoctor } from "./doctor.interface";
import { Doctor } from "./doctor.model";

const createDoctor = async (payload: IDoctor) => {
  const doctor = await Doctor.create(payload);

  return doctor;
};
const getSingleDoctor = async (payload: string) => {
  const doctor = await Doctor.findOne({
    $or: [{ email: payload }, { id: payload }],
  });
  return doctor;
};

export const DoctorService = {
  createDoctor,
  getSingleDoctor,
};
