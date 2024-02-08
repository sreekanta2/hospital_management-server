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
    role: z.string().optional(),
  }),
});

export const UserZodValidation = {
  createUserZodSchema,
};
