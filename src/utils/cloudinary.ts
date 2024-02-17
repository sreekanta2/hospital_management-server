import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: "dnpcna4up",
  api_key: "546493736334591",
  api_secret: "UMJiS7NbvZw6PYgin4qF4_hkgc8",
});

const fileUploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localFilePath);

    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
  }
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function deleteImageOnCloudinary(publicId: any) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export { deleteImageOnCloudinary, fileUploadOnCloudinary };
