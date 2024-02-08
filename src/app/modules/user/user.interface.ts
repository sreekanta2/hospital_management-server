import { Model, Types } from "mongoose";

export interface IUser {
  id: string;
  email: string | [];
  password: string;
  refreshToken?: string;
  role: string;
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
}
interface IUserMethods {
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  checkPassword(givenPassword: string): Promise<boolean>;
}
export interface UserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExit(email: string): Promise<IUser>;
}
