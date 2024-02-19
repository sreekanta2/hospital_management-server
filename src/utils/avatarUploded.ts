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

export async function avatarUploaded(avatar: string, urlId: string) {
  try {
    if (avatar && urlId) {
      await cloudinary.uploader.destroy(urlId);
    }
    const response = await cloudinary.uploader.upload(avatar, {
      resource_type: "auto",
    });
    fs.unlinkSync(avatar);
    return response;
  } catch (error) {
    fs.unlinkSync(avatar);
    errorLogger.error(error);
  }
}

export async function uploadGalleryImages(
  images: Express.Multer.File[],
  savedImages: any
) {
  try {
    if (images.length > 0 && savedImages.length > 0) {
      await Promise.all(
        savedImages.map(async (image: { public_id: string }) => {
          await cloudinary.uploader.destroy(image?.public_id);
        })
      );
    }
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
      })
    );
    return gallery;
  } catch (error) {
    if (images) {
      images.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
  }
}
export async function deleteAvatar(avatarId: string) {
  if (avatarId) {
    const response = await cloudinary.uploader.destroy(avatarId);
    return response;
  }
}
export async function deleteGalleryImages(savedImages: any) {
  const response = await Promise.all(
    savedImages.map(async (image: { public_id: string }) => {
      await cloudinary.uploader.destroy(image?.public_id);
    })
  );
  return response;
}
