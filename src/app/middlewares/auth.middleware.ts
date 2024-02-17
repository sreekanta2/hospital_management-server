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
        "invalid token & user already logout please  login !!"
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
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export { verifyJwt };
