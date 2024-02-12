import { z } from "zod";

const ScheduleSchema = z.object({
  day: z.string(),
  hours: z.array(
    z.object({
      start: z.string(),
      end: z.string(),
    })
  ),
});

const ClinicSchema = z.object({
  name: z.string(),
  address: z.string(),
  image: z.array(
    z.object({
      url1: z.string(),
      url2: z.string(),
    })
  ),
});

const ContactSchema = z.object({
  address1: z.string(),
  address2: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  postalCode: z.string(),
});

const EducationSchema = z.object({
  degree: z.string(),
  college: z.string(),
  yearOfCompletion: z.string(),
});

const ExperienceSchema = z.object({
  hospitalName: z.string(),
  from: z.string(),
  to: z.string(),
  designation: z.string(),
});

const AwardSchema = z.object({
  award: z.string(),
  year: z.string(),
});

const RegistrationSchema = z.object({
  registration: z.string(),
  year: z.string(),
});

const GalleryImageSchema = z.object({
  imageUrl: z.string(),
});

const updateDoctorZodSchema = z.object({
  body: z.object({
    firstName: z.string({
      required_error: "fistname is required",
    }),
    lastName: z.string(),
    rating: z.number(),
    phoneNumber: z.string({
      required_error: "phone number  is required",
    }),
    gender: z.enum(["Male", "Female", "Other"]),
    dateOfBirth: z.string(),
    profile_thumb: z.string(),

    gallery: z.array(GalleryImageSchema),
    schedule: z.array(ScheduleSchema),
    clinic: z.array(ClinicSchema),
    contact: z.array(ContactSchema),
    price: z.string(),
    service: z.array(z.string()),
    specializations: z.string(),
    education: z.array(EducationSchema),
    experience: z.array(ExperienceSchema),
    awards: z.array(AwardSchema),
    registrations: z.array(RegistrationSchema),
  }),
});

export const DoctorZodValidation = {
  updateDoctorZodSchema,
};
