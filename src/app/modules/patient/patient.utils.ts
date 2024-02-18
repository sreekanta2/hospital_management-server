import { Patient } from "./model";

const findLastPatientId = async () => {
  const currentId = await Patient.findOne({}, { id: 1, _id: 0 })
    .sort({
      createdAt: -1,
    })
    .lean();

  return currentId?.id ? currentId.id.substring(4) : null;
};
export const generatePatientId = async () => {
  const currentId =
    (await findLastPatientId()) || (0).toString().padStart(5, "0");
  let incrementalId = (parseInt(currentId) + 1).toString().padStart(5, "0");
  incrementalId = `P${incrementalId}`;

  return incrementalId;
};
