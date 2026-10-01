import multer from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const uploadAnimeImage = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
    files: 1,
  },

  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new Error("Only JPEG, PNG, and WebP images are allowed."),
      );
    }

    callback(null, true);
  },
}).single("image");

export default uploadAnimeImage;
