import crypto from "crypto";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../utils/ApiError";
import { accessTokenAndRefreshTokenGenerate } from "../../../utils/generateAccessRefreshToken";
import { sendEmail } from "../../../utils/sendMail";
import { User } from "../user/user.model";
import { IChangePassword, ILogin, ILoginResponse } from "./auth.interface";

const login = async (payload: ILogin): Promise<ILoginResponse> => {
  const { email, password } = payload;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exit!!");
  }
  const isMatched = await user.checkPassword(password);
  if (!isMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect");
  }

  const { accessToken, refreshToken } =
    await accessTokenAndRefreshTokenGenerate(user.id);

  return { accessToken, refreshToken };
};
const logout = async (payload: JwtPayload) => {
  try {
    const result = await User.findOneAndUpdate(
      payload,
      {
        $set: {
          refreshToken: "",
        },
      },
      {
        new: true,
      }
    );
    return result;
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "some thing went wrong tray again!"
    );
  }
};
const changePassword = async (
  payload: string,
  passwordData: IChangePassword
) => {
  const { oldPassword, newPassword } = passwordData;

  if (oldPassword === newPassword) {
    throw new Error("old and new password are same!");
  }

  const user = await User.findOne({
    $or: [{ email: payload }, { id: payload }],
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exit!!");
  }

  const verifiedUser = await user.checkPassword(oldPassword);
  if (!verifiedUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "old password incorrect!!");
  }
  user.password = newPassword;
  user.save();

  return true;
};

const forgatPassword = async (resetUrl: string, email: string) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't  exit !!");
  }
  try {
    const resetToken = await user.createResetPassword();
    user.save({ validateBeforeSave: false });
    const resetLink = `${resetUrl}/${resetToken}`;
    const subject = "Email Reset link";
    const html = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset Email</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #3498db;
          color: #fff;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .footer {
          background-color: #2c3e50;
          color: #fff;
          padding: 10px;
          text-align: center;
        }
        .reset-link {
          display: block;
          background-color: #4caf50;
          color: #fff;
          text-decoration: none;
          padding: 10px;
          margin-top: 20px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password. If you did not make this request, please ignore this email.</p>
          <p>To reset your password, click the link below:</p>
          <a href="{${resetLink}}" target="_blank" class="reset-link">Reset Password</a>
          <p>If the above link doesn't work, copy and paste the following URL into your browser:</p>
          <p>${resetLink}</p>
          <p>This link will expire in 1 hour for security reasons.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 Your Company. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;
    const result = await sendEmail(email, subject, html);
    return result;
  } catch (error) {
    user.passwordResetToken = "";
    user.passwordResetTokenExpire = "";
    user.save();
    throw new ApiError(httpStatus.BAD_REQUEST, "send email faild");
  }
};

const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
) => {
  if (!(password === confirmPassword)) {
    throw new Error("password and confirm password not match !!");
  }
  const verifyToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: verifyToken,
  });
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "invaild token and  expire your reset password link"
    );
  }
  user.password = password;

  user.passwordResetToken = "";
  user.passwordResetTokenExpire = "";
  user.save();
};

export const AuthService = {
  login,
  logout,
  changePassword,
  forgatPassword,
  resetPassword,
};
