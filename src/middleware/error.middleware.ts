import type { ErrorRequestHandler } from "express";
import multer from "multer";
import { ZodError } from "zod";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  console.error(error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: error.issues,
    });
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "Image file must not exceed 5 MB.",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "Only one image can be uploaded.",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  if (error instanceof Error) {
    if (error.message === "Anime not found.") {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "An unexpected error occurred.",
  });
};
