import { Schema } from "mongoose";

export interface IConversation {
  participants: Array<Schema.Types.ObjectId>;
  messages: Array<Schema.Types.ObjectId>;
}
