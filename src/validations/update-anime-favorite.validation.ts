import { z } from "zod";

export const updateAnimeFavoriteSchema = z.object({
  is_favorite: z.boolean(),
});
