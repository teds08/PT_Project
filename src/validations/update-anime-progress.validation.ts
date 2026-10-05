import { z } from "zod";

export const updateAnimeProgressSchema = z.object({
  progress: z
    .number()
    .int("Progress must be a whole number.")
    .nonnegative("Progress cannot be negative."),
});
