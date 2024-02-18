import { Model } from "mongoose";

export interface IUser {
  email: string;
  role: string;
  username: string;
  password: string;
  refreshToken?: string;
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
