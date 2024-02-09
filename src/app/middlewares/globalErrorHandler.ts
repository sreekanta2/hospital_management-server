/* eslint-disable no-undefined */
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { IGenericErrors } from "../../interfaces/error";
import ApiError from "../../utils/ApiError";

import {
  handleCastError,
  handleValidationError,
} from "../../utils/errorModifer";
import { handleZodSimplifiedError } from "../../utils/handleZodSimplifiedError";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = 500;
  let message = "Something went wrong !";
  let errorMessages: IGenericErrors[] = [];
  if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode;
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodSimplifiedError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorMessages = simplifiedError?.errorMessages;
  } else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (error instanceof Error) {
    message = error?.message;
    errorMessages = error?.message
      ? [
          {
            path: "",
            message: error?.message,
          },
        ]
      : [];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,

    stack: process.env.NODE_ENV !== "production" ? error?.stack : undefined,
  });
  next();
};
