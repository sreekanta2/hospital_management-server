import { z } from "zod";

const createLoginZodSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: "email is required",
    }),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});
const createChangePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: "old password  is required",
    }),
    newPassword: z.string({
      required_error: " new password   is required",
    }),
  }),
});
const forgatPasswordZodValidation = z.object({
  body: z.object({
    email: z.string({
      required_error: "email is required",
    }),
  }),
});
const resetPasswordZodValidation = z.object({
  body: z.object({
    password: z.string({
      required_error: "password is required",
    }),
    confirmPassword: z.string({
      required_error: "confirm password is required",
    }),
  }),
});

export const AuthValidation = {
  createLoginZodSchema,
  createChangePasswordZodSchema,
  forgatPasswordZodValidation,
  resetPasswordZodValidation,
};
