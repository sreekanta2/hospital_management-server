import { z } from "zod";

const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string(),
    status: z.boolean(),
    confirmDate: z.string().optional(),
    amount: z.string().optional(),
  }),
});
const updateZodSchema = z.object({
  body: z.object({
    status: z.boolean().optional(),
    confirmDate: z.string().optional(),
    amount: z.string().optional(),
  }),
});

export const AppointmentZodSchema = {
  createAppointmentSchema,
  updateZodSchema,
};
