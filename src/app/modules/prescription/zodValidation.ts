import { Types } from "mongoose";
import { z } from "zod";

const MedicineSchema = z.object({
  name: z.string(),
  qty: z.number().default(1),
  morning: z.boolean().default(false),
  evening: z.boolean().default(false),
  night: z.boolean().default(false),
  weight: z.number(),
});

const PrescriptionSchema = z.object({
  body: z.object({
    patient: z.string().refine((value) => Types.ObjectId.isValid(value), {
      message: "Invalid ObjectId for patient",
    }),
    doctor: z.string().refine((value) => Types.ObjectId.isValid(value), {
      message: "Invalid ObjectId for doctor",
    }),
    medicines: z.array(MedicineSchema),
  }),
});
export const PrescriptionZodValidation = { PrescriptionSchema };
