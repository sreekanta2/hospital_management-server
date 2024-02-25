export interface IDoctor {
  gallery: { url: string | undefined; public_id: string | undefined }[];
  email: string;
  id: string;
  rating: number;
  phoneNumber: string;
  description: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string; // Assuming date is provided as a string for simplicity
  schedule: {
    day: string;
    hours: {
      start: string;
      end: string;
    }[];
  }[];

  contact: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  price: string;
  service: string[];
  specializations: string;
  education: {
    degree: string;
    college: string;
    yearOfCompletion: string;
  }[];
  experience: {
    hospitalName: string;
    from: string; // Assuming date is provided as a string for simplicity
    to: string; // Assuming date is provided as a string for simplicity
    designation: string;
  }[];
  awards: {
    award: string;
    year: string;
  }[];
  registrations: {
    registration: string;
    year: string;
  }[];
}

export interface IGallery {
  url: string | undefined;
  public_id: string | undefined;
}
