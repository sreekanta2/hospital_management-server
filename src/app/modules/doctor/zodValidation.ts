import { z } from "zod";

const createDoctorZodSchema = z.object({
  userId: z.string().uuid().optional(),

  username: z.string().trim(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  description: z.string(),
  rating: z.number(),
  phoneNumber: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  dateOfBirth: z.string(),
  profile_thumb: z.object({
    url: z.string(),
    public_id: z.string(),
  }),
  gallery: z.array(
    z.object({
      url: z.string(),
      public_id: z.string(),
    })
  ),
  schedule: z.array(
    z.object({
      day: z.string(),
      hours: z.array(
        z.object({
          start: z.string(),
          end: z.string(),
        })
      ),
    })
  ),
  clinic: z.array(
    z.object({
      name: z.string(),
      address: z.string(),
      image: z.array(
        z.object({
          url1: z.string(),
          url2: z.string(),
        })
      ),
    })
  ),
  contact: z.object({
    address1: z.string(),
    address2: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    postalCode: z.string(),
  }),
  price: z.string(),
  service: z.array(z.string()),
  specializations: z.string(),
  education: z.array(
    z.object({
      degree: z.string(),
      college: z.string(),
      yearOfCompletion: z.string(),
    })
  ),
  experience: z.array(
    z.object({
      hospitalName: z.string(),
      from: z.date(),
      to: z.date(),
      designation: z.string(),
    })
  ),
  awards: z.array(
    z.object({
      award: z.string(),
      year: z.string(),
    })
  ),
  registrations: z.array(
    z.object({
      registration: z.string(),
      year: z.string(),
    })
  ),
});

export const DoctorZodValidation = {
  createDoctorZodSchema,
};
