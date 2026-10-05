import { cloudinary } from "../config/cloudinary";

export const deleteFromCloudinary = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (result.result !== "ok" && result.result !== "not found") {
          return reject(
            new Error(
              `Cloudinary image deletion failed with result: ${result.result}`,
            ),
          );
        }

        resolve();
      },
    );
  });
};
