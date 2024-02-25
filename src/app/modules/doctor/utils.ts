import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../../../utils/ApiError";
import {
  multipleFilesUpdate,
  multipleFilesUpload,
  singleFileUpdated,
  singleFileUploaded,
} from "../../../utils/cloudinary";
import { IDoctor } from "./interface";

export const updateAvatar = async (
  avatar: string,
  existingUser: JwtPayload
) => {
  try {
    if (avatar && existingUser?.avatar?.public_id) {
      // Update avatar with existing public_id
      const savedAvatar = await singleFileUpdated(
        avatar,
        existingUser.avatar.public_id
      );
      if (!savedAvatar) {
        throw new ApiError(httpStatus.BAD_REQUEST, "avatar update field!");
      }
      existingUser.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    } else {
      // Upload a new avatar
      const savedAvatar = await singleFileUploaded(avatar);
      if (!savedAvatar) {
        throw new ApiError(httpStatus.BAD_REQUEST, "avatar uploaded field!");
      }
      existingUser.avatar = {
        url: savedAvatar?.secure_url,
        public_id: savedAvatar.public_id,
      };
    }
    return existingUser;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};
export const updateGalleryImages = async (
  galleryImages: Express.Multer.File[],
  existingDoctor: JwtPayload
) => {
  try {
    let savedGalleryImages;
    if (
      Array.isArray(existingDoctor.gallery) &&
      existingDoctor.gallery.length > 0 &&
      galleryImages.length > 0
    ) {
      // Update existing gallery images
      savedGalleryImages = await multipleFilesUpdate(
        galleryImages,
        existingDoctor.gallery
      );
      if (!savedGalleryImages) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "gallery images updated field!"
        );
      }
    } else {
      // Upload new gallery images
      savedGalleryImages = await multipleFilesUpload(galleryImages);
      if (!savedGalleryImages) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "gallery images uploaded field!"
        );
      }
    }
    return savedGalleryImages;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};
export const updateUserData = async (
  payload: IDoctor,
  existingUser: JwtPayload
) => {
  try {
    existingUser.set(payload);
    return existingUser.save();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `${error}`);
  }
};
