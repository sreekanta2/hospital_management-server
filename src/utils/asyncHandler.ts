import { NextFunction, Request, Response } from "express";

type RequestHandlerParams = (
  req: Request,
  res: Response,
  next: NextFunction
) => unknown;

export const asyncHandler = (requestHandler: RequestHandlerParams) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((error) =>
      next(error)
    );
  };
};
