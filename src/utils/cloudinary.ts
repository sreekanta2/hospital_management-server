/* eslint-disable @typescript-eslint/no-explicit-any */
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { IGallery } from "../app/modules/doctor/interface";
import { errorLogger } from "../shared/logger";

cloudinary.config({
  cloud_name: "dnpcna4up",
  api_key: "546493736334591",
  api_secret: "UMJiS7NbvZw6PYgin4qF4_hkgc8",
});

export async function deleteAvatar(avatarId: string) {
  if (avatarId) {
    const response = await cloudinary.uploader.destroy(avatarId);
    return response;
  }
}

export async function deleteGalleryImages(savedImages: any) {
  const response = await Promise.all(
    savedImages?.map(async (image: { public_id: string }) => {
      await cloudinary.uploader.destroy(image?.public_id);
    })
  );
  return response;
}

export async function avatarUploaded(
  newImagePath: string,
  oldPublicId: string
) {
  try {
    if (oldPublicId) {
      const response = await cloudinary.uploader.upload(newImagePath);

      await deleteAvatar(oldPublicId);
      fs.unlinkSync(newImagePath);
      return response;
    }
    if (newImagePath) {
      const response = await cloudinary.uploader.upload(newImagePath, {
        resource_type: "auto",
      });
      fs.unlinkSync(newImagePath);
      return response;
    }
  } catch (error) {
    fs.unlinkSync(newImagePath);
    errorLogger.error(error);
  }
}

export async function uploadGalleryImages(
  images: Express.Multer.File[],
  savedImages: any
) {
  try {
    if (Array.isArray(savedImages) && savedImages.length > 0) {
      const gallery: IGallery[] = [];

      // Upload new images
      await Promise.all(
        images.map(async (image) => {
          const galleryImage = await cloudinary.uploader.upload(image.path, {
            resource_type: "auto",
          });

          gallery.push({
            url: galleryImage?.secure_url,
            public_id: galleryImage?.public_id,
          });
          fs.unlinkSync(image.path);
        })
      );

      // Delete existing images
      await deleteGalleryImages(savedImages);

      return gallery;
    } else {
      // If no existing images, simply upload the new ones
      const gallery: IGallery[] = [];
      await Promise.all(
        images.map(async (image) => {
          const galleryImage = await cloudinary.uploader.upload(image.path, {
            resource_type: "auto",
          });

          gallery.push({
            url: galleryImage?.secure_url,
            public_id: galleryImage?.public_id,
          });
          fs.unlinkSync(image.path);
        })
      );
      return gallery;
    }
  } catch (error) {
    console.error(error);
    if (images) {
      images.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
  }
}
