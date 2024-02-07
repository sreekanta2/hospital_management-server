import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ApiError from "../../utils/ApiError";
import { User } from "../modules/user/user.model";

const verifyJwt = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "invalid token & user nort login"
      );
    }

    const decodedUser = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as JwtPayload;

    if (!decodedUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized user");
    }

    const user = await User.findOne({ email: decodedUser.email }).select(
      "-password -refreshToken"
    );
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export { verifyJwt };
