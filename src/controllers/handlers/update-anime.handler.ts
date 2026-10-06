import { Request, Response } from "express";

import { UpdateAnimeService } from "../../services/update-anime.service";
import { updateAnimeSchema } from "../../validations/update-anime.validation";

const updateAnimeService = new UpdateAnimeService();

export const updateAnime = async (req: Request, res: Response) => {
  const animeId = Number(req.params.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return res.status(400).json({
      message: "Invalid anime ID.",
    });
  }

  const validation = updateAnimeSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.error.issues,
    });
  }

  const { title, description, episodes, status, is_favorite, website_url } =
    validation.data;

  try {
    const anime = await updateAnimeService.execute(
      animeId,
      req.userId,
      {
        title,
        description,
        episodes,
        status,
        is_favorite,
        website_url,
      },
      req.file?.buffer,
    );

    return res.status(200).json({
      message: "Anime updated successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Update anime error:", error);

    if (error instanceof Error && error.message === "Anime not found.") {
      return res.status(404).json({
        message: "Anime not found.",
      });
    }

    if (
      error instanceof Error &&
      (error.message === "Invalid anime ID." ||
        error.message === "Invalid user ID." ||
        error.message === "Anime title is required." ||
        error.message === "Episodes must be a positive whole number." ||
        error.message === "Invalid anime status.")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update anime. Please try again.",
    });
  }
};
