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

export async function singleFileDelete(avatarId: string) {
  if (avatarId) {
    const response = await cloudinary.uploader.destroy(avatarId);
    return response;
  }
}

export async function multipleFilesDelete(savedImages: any) {
  const response = await Promise.all(
    savedImages?.map(async (image: { public_id: string }) => {
      await cloudinary.uploader.destroy(image?.public_id);
    })
  );
  return response;
}

export async function singleFileUploaded(newImagePath: string) {
  try {
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
export async function singleFileUpdated(
  newImagePath: string,
  oldPublicId: string
) {
  if (oldPublicId) {
    const response = await cloudinary.uploader.upload(newImagePath);

    await singleFileDelete(oldPublicId);
    fs.unlinkSync(newImagePath);
    return response;
  }
}
export async function multipleFilesUpload(images: Express.Multer.File[]) {
  try {
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
  } catch (error) {
    console.error(error);
    if (images) {
      images.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
  }
}
export async function multipleFilesUpdate(
  images: Express.Multer.File[],
  savedImages: IGallery[]
) {
  try {
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

    // Delete existing images
    await multipleFilesDelete(savedImages);

    return gallery;
  } catch (error) {
    console.error(error);
    if (images) {
      images.forEach((image) => {
        fs.unlinkSync(image.path);
      });
    }
  }
}
