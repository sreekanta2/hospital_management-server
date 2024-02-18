import { Types } from "mongoose";

export interface Medicine {
  name: string;
  qty?: number;
  morning: boolean;
  evening: boolean;
  night: boolean;
  weight: number;
}
export interface IPrescription {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  medicines: Medicine[];
}
