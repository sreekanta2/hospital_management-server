import mongoose from "mongoose";
import { ZodError, ZodIssue } from "zod";
import { IGenericErrorResponse, IGenericErrors } from "../interfaces/error";
export const handleValidationError = (
  error: mongoose.Error.ValidationError
): IGenericErrorResponse => {
  const errors: IGenericErrors[] = Object.values(error.errors).map(
    (el: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: el?.path,
        message: el?.message,
      };
    }
  );
  const statusCode = 400;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors: IGenericErrors[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};

export const handleCastError = (
  error: mongoose.Error.CastError
): IGenericErrorResponse => {
  const errors: IGenericErrors[] = [
    {
      path: error?.path,
      message: `Invalid ${error?.path}`,
    },
  ];
  const statusCode = 500;
  return {
    statusCode,
    message: "Validation Error",
    errorMessages: errors,
  };
};
