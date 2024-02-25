import mongoose, { Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName: string;
  lastName: string;
  avatar?: {
    url: string;
    public_id: string;
  };
  role: string;
  id: string;
  doctorId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
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
