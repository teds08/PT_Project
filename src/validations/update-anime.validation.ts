import { z } from "zod";

export const updateAnimeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Anime title is required.")
    .max(255, "Anime title must not exceed 255 characters.")
    .optional(),

  description: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    }),

  episodes: z
    .string()
    .regex(/^\d+$/, "Episodes must be a positive whole number.")
    .transform(Number)
    .pipe(
      z.number().int().positive("Episodes must be a positive whole number."),
    )
    .optional(),

  status: z
    .enum(["Watching", "Completed", "Plan to Watch", "On Hold", "Dropped"])
    .optional(),

  is_favorite: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true"),

  website_url: z
    .string()
    .optional()
    .transform((value) => {
      const trimmed = value?.trim();
      return trimmed ? trimmed : null;
    })
    .pipe(z.string().url("Please provide a valid website URL.").nullable()),
});
