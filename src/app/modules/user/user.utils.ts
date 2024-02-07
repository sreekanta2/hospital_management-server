import { User } from "./user.model";

// generate id
const findLastDoctorId = async () => {
  const currentId = await User.findOne({ role: "doctor" }, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return currentId?.id ? currentId.id.substring(4) : null;
};
export const generateDoctorId = async () => {
  const currentId =
    (await findLastDoctorId()) || (0).toString().padStart(5, "0");
  let incrementalId = (parseInt(currentId) + 1).toString().padStart(5, "0");
  incrementalId = `D${incrementalId}`;

  return incrementalId;
};
