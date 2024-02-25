import { z } from "zod";

const messageSchemaZod = z.object({
  body: z.object({
    receiverId: z
      .string()
      .refine((value) => value.match(/^[0-9a-fA-F]{24}$/), {
        message: "Invalid ObjectId for reviver id ",
      })
      .optional(),
    message: z.string(),
  }),
});

export const messageZodValidation = { messageSchemaZod };
