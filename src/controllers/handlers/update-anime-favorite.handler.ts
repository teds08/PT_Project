import { Request, Response } from "express";

import { UpdateAnimeService } from "../../services/update-anime.service";
import { updateAnimeFavoriteSchema } from "../../validations/update-anime-favorite.validation";

const updateAnimeService = new UpdateAnimeService();

const DEV_USER_ID = 1;

export const updateAnimeFavorite = async (req: Request, res: Response) => {
  const animeId = Number(req.params.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return res.status(400).json({
      message: "Invalid anime ID.",
    });
  }

  const validation = updateAnimeFavoriteSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.error.issues,
    });
  }

  const { is_favorite } = validation.data;

  try {
    const anime = await updateAnimeService.executeFavorite(
      animeId,
      DEV_USER_ID,
      is_favorite,
    );

    return res.status(200).json({
      message: "Anime favorite status updated successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Update anime favorite error:", error);

    if (error instanceof Error && error.message === "Anime not found.") {
      return res.status(404).json({
        message: "Anime not found.",
      });
    }

    if (
      error instanceof Error &&
      (error.message === "Invalid anime ID." ||
        error.message === "Invalid user ID." ||
        error.message === "Favorite status must be a boolean.")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update anime favorite status. Please try again.",
    });
  }
};
