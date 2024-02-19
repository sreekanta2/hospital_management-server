import { IGallery } from "../app/modules/doctor/interface";
import { fileUploadOnCloudinary } from "./cloudinary";

export const uploadGalleryImages = async (
  galleryImages: Express.Multer.File[]
) => {
  const gallery: IGallery[] = [];

  await Promise.all(
    galleryImages.map(async (image) => {
      const galleryImage = await fileUploadOnCloudinary(image.path);
      gallery.push({
        url: galleryImage?.secure_url,
        public_id: galleryImage?.public_id,
      });
    })
  );

  return gallery;
};
