{
  email, password, refreshToken, role;
}
const doctor = {
  userId,
  username,
  email,
  firstName,
  lastName,
  phoneNumber,
  gender,
  dateOfBirth,
  schedule: [
    {
      day: "Monday",
      hours: [
        { start: "08:00", end: "12:00" },
        { start: "14:00", end: "18:00" },
      ],
    },
  ],
  clinic: [
    {
      name,
      address,
      image: [{ url1, url2 }],
    },
  ],
  contact: [
    {
      address1,
      address2,
      city,
      state,
      country,
      postalCode,
    },
  ],
  price,
  service: [
    "Tooth cleaning  ",
    "Root Canal Therapy",
    "Implants",
    "Composite Bonding",
    "Fissure Sealants",
    "Surgical Extractions",
  ],
  education: [{ degree, college, yearOfCompletion }],
  experience: [
    {
      hospitalName,
      from,
      to,
      designation,
    },
  ],
  awards: [{ award, year }],
  registrations: [
    {
      registration,
      year,
    },
  ],
};

const prescription = {
  patinetId: "PI0001",
  doctorID: "PI0001",
  medicine: [
    {
      name: "",
      qty: 1,
      morning: true,
      evining: false,
      night: true,
      weight: 100,
    },
  ],
};

const doct = {
  _id: ObjectId,
  name: "Dr. John Doe",
  specialty: "Cardiology",
  schedule: [
    {
      day: "Monday",
      hours: [
        { start: "08:00", end: "12:00" },
        { start: "14:00", end: "18:00" },
      ],
    },
  ],
};

const pat = {
  _id: ObjectId("patient_id"),
  name: "Alice Smith",
  contact: "987-654-3210",
  // ... other patient details
};
const appt = {
  _id: ObjectId("appointment_id"),
  doctor_id: ObjectId("doctor_id"),
  patient_id: ObjectId("patient_id"),
  datetime: ISODate("2024-02-04T14:30:00Z"),
  status: "scheduled",
};
const pre = {
  _id: ObjectId("prescription_id"),
  patient_id: ObjectId("patient_id"),
  doctor_id: ObjectId("doctor_id"),
  medications: [
    {
      name: "Aspirin",
      dosage: "75mg",
      instructions: "Take once a day",
    },
    // ... other medications
  ],
  issued_date: ISODate("2024-02-04T15:45:00Z"),
};
const pres = {
  _id: ObjectId("review_id"),
  doctor_id: ObjectId("doctor_id"),
  patient_id: ObjectId("patient_id"),
  rating: 4.5,
  comments: "Dr. John Doe was very knowledgeable and helpful.",
};
