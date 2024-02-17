import jwt, { Secret } from "jsonwebtoken";

import bcrypt from "bcrypt";
import crypto from "crypto";

import mongoose, { Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";

const userSchema = new Schema<IUser, UserModel>(
  {
    email: {
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
    },

    refreshToken: {
      type: String,
    },

    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpire: {
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

userSchema.statics.isUserExit = async function (id, email) {
  const result = await User.findOne({
    $or: [
      {
        email,
      },
      {
        id,
      },
    ],
  });
  return result;
};
userSchema.methods.checkPassword = async function (givenPassword: string) {
  return await bcrypt.compare(givenPassword, this.password);
};
userSchema.methods.createResetPassword = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 100;

  return resetToken;
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
