import { z } from "zod";
const medicalRecordZodSchema = z.object({
  body: z.object({
    patient: z.string().refine((value) => value.match(/^[0-9a-fA-F]{24}$/), {
      message: "Invalid ObjectId for patient",
    }),
    doctor: z.string().refine((value) => value.match(/^[0-9a-fA-F]{24}$/), {
      message: "Invalid ObjectId for doctor",
    }),
    description: z.string().min(1),
  }),
});

const updateRecordZodSchema = z.object({
  body: z.object({
    description: z.string().min(1),
  }),
});
export const MedicalRecordZodValidation = {
  medicalRecordZodSchema,
  updateRecordZodSchema,
};
