import type { ErrorRequestHandler } from "express";
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
