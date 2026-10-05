import { z } from "zod";

export const updateAnimeStatusSchema = z.object({
  status: z.enum([
    "Watching",
    "Completed",
    "Plan to Watch",
    "On Hold",
    "Dropped",
  ]),
});
