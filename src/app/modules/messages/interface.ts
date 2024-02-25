import { Types } from "mongoose";

export interface IMessage {
  receiverId: Types.ObjectId;
  senderId: Types.ObjectId;
  message: string;
}
