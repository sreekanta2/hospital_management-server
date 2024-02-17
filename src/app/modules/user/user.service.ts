import { IUser } from "./user.interface";
import { User } from "./user.model";

const register = async (userData: IUser): Promise<Partial<IUser> | null> => {
  const user = await User.create(userData);

  return user;
};
// const registerDoctor = async (user: IUser): Promise<Partial<IUser> | null> => {
//   let newUserAllData = null;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const id = await generateDoctorId();
//     user.id = id;
//     user.role = "doctor";

//     const newDoctor = await Doctor.create(
//       [{ email: user.email, id: user.id }],
//       {
//         session,
//       }
//     );

//     if (!newDoctor.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create doctor");
//     }

//     user.doctor = newDoctor[0]._id;

//     const newUser = await User.create([user], { session });

//     if (!newUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
//     }
//     newUserAllData = newUser[0];

//     await session.commitTransaction();
//     await session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }
//   if (newUserAllData) {
//     newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
//       path: "doctor",
//     });
//   }
//   return newUserAllData;
// };
// const registerPatient = async (user: IUser): Promise<Partial<IUser> | null> => {
//   let newUserAllData = null;
//   const session = await mongoose.startSession();
//   try {
//     session.startTransaction();
//     const id = await generatePatientId();
//     user.id = id;
//     user.role = "patient";

//     const newPatient = await Patient.create(
//       [{ email: user.email, id: user.id, cloudinary_id: "" }],
//       {
//         session,
//       }
//     );

//     if (!newPatient.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create patient");
//     }

//     user.patient = newPatient[0]._id;

//     const newUser = await User.create([user], { session });

//     if (!newUser.length) {
//       throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
//     }
//     newUserAllData = newUser[0];

//     await session.commitTransaction();
//     await session.endSession();
//   } catch (error) {
//     await session.abortTransaction();
//     await session.endSession();
//     throw error;
//   }
//   if (newUserAllData) {
//     newUserAllData = await User.findOne({ id: newUserAllData.id }).populate({
//       path: "patient",
//     });
//   }
//   return newUserAllData;
// };

export const UserService = {
  register,
};
