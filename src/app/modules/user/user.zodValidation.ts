import { z } from "zod";

const createUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email()
      .toLowerCase(),
    password: z.string({
      required_error: "password is required",
    }),
    role: z.string({
      required_error: "role is required",
    }),
  }),
});
const loginUserZodSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "email is required",
      })
      .email()
      .toLowerCase(),
    password: z.string({
      required_error: "password is required",
    }),
  }),
});
export const UserZodValidation = {
  createUserZodSchema,
  loginUserZodSchema,
};
