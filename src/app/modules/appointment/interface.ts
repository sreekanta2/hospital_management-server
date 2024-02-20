import { Types } from "mongoose";
export interface IAppointment {
  doctorId: Types.ObjectId | string;
  patientId?: Types.ObjectId | string;
  status: boolean;
  confirmDate?: Date;
  amount?: string;
}
