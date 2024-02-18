import { Types } from "mongoose";

export interface IMedicalRecord {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  description: string;
  doc: {
    url: string | undefined;
    public_id: string | undefined;
  };
}
