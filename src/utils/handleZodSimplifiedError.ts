import { ZodError, ZodIssue } from "zod";
import { IGenericErrorResponse, IGenericErrors } from "../interfaces/error";

export const handleZodSimplifiedError = (
  error: ZodError
): IGenericErrorResponse => {
  const errors: IGenericErrors[] = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  return {
    statusCode: 403,
    message: "Zod validation error",
    errorMessages: errors,
  };
};
