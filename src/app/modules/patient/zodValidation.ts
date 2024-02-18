import { z } from "zod";

const patientZodSchema = z.object({
  body: z.object({
    firstName: z.string(),
    cloudinary_id: z.string().optional(),
    lastName: z.string(),
    phoneNumber: z.string(),
    gender: z.enum(["Male", "Female", "Other"]),
    dateOfBirth: z.string(),
    avatar: z.string().optional(),
    bloodGroup: z.enum([
      "A+",
      "A-",
      "B+",
      "B-",
      "AB+",
      "AB-",
      "O+",
      "O-",
      "unknown",
    ]),
    contact: z
      .object({
        address1: z.string(),
        address2: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        postalCode: z.string(),
      })
      .optional(),
  }),
});
const updatePatientZodSchema = z.object({
  body: z.object({
    firstName: z.string().optional(),
    cloudinary_id: z.string().optional(),
    lastName: z.string().optional(),
    phoneNumber: z.string().optional(),
    gender: z.enum(["Male", "Female", "Other"]).optional(),
    dateOfBirth: z.string().optional(),
    avatar: z.string().optional(),
    bloodGroup: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"])
      .optional(),
    contact: z
      .object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        country: z.string().optional(),
        postalCode: z.string().optional(),
      })
      .optional(),
  }),
});

export const PatientZodValidation = {
  patientZodSchema,
  updatePatientZodSchema,
};
