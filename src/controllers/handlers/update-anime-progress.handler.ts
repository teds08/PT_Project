import { Request, Response } from "express";

import { UpdateAnimeService } from "../../services/update-anime.service";
import { updateAnimeProgressSchema } from "../../validations/update-anime-progress.validation";

const updateAnimeService = new UpdateAnimeService();

export const updateAnimeProgress = async (req: Request, res: Response) => {
  const animeId = Number(req.params.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return res.status(400).json({
      message: "Invalid anime ID.",
    });
  }

  const validation = updateAnimeProgressSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.error.issues,
    });
  }

  const { progress } = validation.data;

  try {
    const anime = await updateAnimeService.executeProgress(
      animeId,
      req.userId,
      progress,
    );

    return res.status(200).json({
      message: "Anime progress updated successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Update anime progress error:", error);

    if (error instanceof Error && error.message === "Anime not found.") {
      return res.status(404).json({
        message: "Anime not found.",
      });
    }

    if (
      error instanceof Error &&
      (error.message === "Invalid anime ID." ||
        error.message === "Invalid user ID." ||
        error.message === "Progress must be a non-negative whole number." ||
        error.message.startsWith(
          "Progress cannot exceed the total number of episodes",
        ) ||
        error.message === "Anime could not be updated.")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update anime progress. Please try again.",
    });
  }
};
