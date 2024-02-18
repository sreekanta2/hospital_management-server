import { Model, Schema, model } from "mongoose";
import { ILogin } from "./interface";

const LoginSchema = new Schema<ILogin>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
  },
});

export type LoginModal = Model<ILogin, object>;
export const Login = model<ILogin, LoginModal>("Login", LoginSchema);
