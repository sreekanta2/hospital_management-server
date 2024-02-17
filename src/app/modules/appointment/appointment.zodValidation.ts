import { z } from "zod";

const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: z.string(),
    patientId: z.string(),
    status: z.boolean(),
    confirmDate: z.string().optional(),
    amount: z.string().optional(),
  }),
});
const updateZodSchema = z.object({
  body: z.object({
    doctorId: z.string().optional(),
    patientId: z.string().optional(),
    status: z.boolean().optional(),
    confirmDate: z.string().optional(),
    amount: z.string().optional(),
  }),
});

export const AppointmentZodSchema = {
  createAppointmentSchema,
  updateZodSchema,
};
