import { Types } from "mongoose";

export interface IReview {
  doctorId: Types.ObjectId | string;
  patientId: Types.ObjectId | string;
  rating: number;
  description: string;
}
