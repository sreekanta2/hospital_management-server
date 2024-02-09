import { Model, Types } from "mongoose";

export interface IUser {
  id: string;
  email: string | [];
  password: string;
  confirmPassword: string;
  refreshToken?: string;
  role: string;
  doctor: Types.ObjectId;
  patient: Types.ObjectId;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetTokenExpire: string;
}
interface IUserMethods {
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
  checkPassword(givenPassword: string): Promise<boolean>;
  createResetPassword(): string;
}
export interface UserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExit(email: string): Promise<IUser>;
}
