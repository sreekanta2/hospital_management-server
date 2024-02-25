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
    firstName: z.string({
      required_error: " First name is required",
    }),
    lastName: z.string({
      required_error: " Last name is required",
    }),
  }),
});

export const UserZodValidation = {
  createUserZodSchema,
};
