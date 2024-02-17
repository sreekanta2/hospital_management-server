export interface IPatient {
  email: string;
  id: string;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: string;
  profile_thumb: {
    url: string | undefined;
    public_id: string | undefined;
  };
  bloodGroup:
    | "A+"
    | "A-"
    | "B+"
    | "B-"
    | "AB+"
    | "AB-"
    | "O+"
    | "O-"
    | "unknwon";
  contact: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
}
