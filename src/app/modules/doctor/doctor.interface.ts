import { ObjectId } from "mongoose";

interface Schedule {
  day: string;
  hours: {
    start: string;
    end: string;
  }[];
}

interface Clinic {
  name: string;
  address: string;
  image: {
    url1: string;
    url2: string;
  }[];
}

interface Contact {
  address1: string;
  address2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

interface Education {
  degree: string;
  college: string;
  yearOfCompletion: string;
}

interface Experience {
  hospitalName: string;
  from: string;
  to: string;
  designation: string;
}

interface Award {
  award: string;
  year: string;
}

interface Registration {
  registration: string;
  year: string;
}

interface GalleryImage {
  imageUrl: string;
}

export interface IDoctor {
  user: string | ObjectId;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  rating: number;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  profile_thumb: string;

  gallery: GalleryImage[];
  schedule: Schedule[];
  clinic: Clinic[];
  contact: Contact[];
  price: string;
  service: string[];
  Specializations: string[];
  education: Education[];
  experience: Experience[];
  awards: Award[];
  registrations: Registration[];
}
