import { UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import { cloudinary } from "../config/cloudinary";

interface UploadResult {
  imageUrl: string;
  publicId: string;
}

export const uploadToCloudinary = (buffer: Buffer): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "anime-covers",
        resource_type: "image",
      },
      (error, result?: UploadApiResponse) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(
            new Error("Cloudinary did not return an upload result."),
          );
        }

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};
