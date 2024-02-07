import jwt, { Secret } from "jsonwebtoken";

import bcrypt from "bcrypt";

import mongoose, { Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
const userSchema = new Schema<IUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.statics.isUserExit = async function (email: string) {
  return await User.findOne({ email }, { id: 1, email: 1, password: 1 });
};
userSchema.statics.checkPassword = async function (
  givenPassword: string,
  savedPassword: string
) {
  return bcrypt.compare(givenPassword, savedPassword);
};
userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as Secret,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
  );
};
userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
  );
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
