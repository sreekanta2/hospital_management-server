import { z } from "zod";

const reviewSchema = z.object({
  body: z.object({
    patientId: z.string(),
    description: z.string(),
    rating: z.number(),
  }),
});
const updateReviewSchema = z.object({
  body: z.object({
    patientId: z.string(),
    description: z.string(),
    rating: z.number(),
  }),
});
export const ReviewZodValidation = { reviewSchema, updateReviewSchema };
