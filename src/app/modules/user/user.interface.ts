import { Model } from "mongoose";

export interface IUser {
  id: string;
  email: string;
  password: string;
  refreshToken?: string;
  role: string;
}
interface IUserMethods {
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}
export interface UserModel
  extends Model<IUser, Record<string, never>, IUserMethods> {
  isUserExit(email: string): Promise<Pick<IUser, "email" | "id" | "password">>;
  checkPassword(givenPassword: string, savedPassword: string): Promise<boolean>;
}
