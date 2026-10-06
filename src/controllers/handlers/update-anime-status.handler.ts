import { Request, Response } from "express";

import { UpdateAnimeService } from "../../services/update-anime.service";
import { updateAnimeStatusSchema } from "../../validations/update-anime-status.validation";

const updateAnimeService = new UpdateAnimeService();

export const updateAnimeStatus = async (req: Request, res: Response) => {
  const animeId = Number(req.params.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return res.status(400).json({
      message: "Invalid anime ID.",
    });
  }

  const validation = updateAnimeStatusSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.error.issues,
    });
  }

  const { status } = validation.data;

  try {
    const anime = await updateAnimeService.executeStatus(
      animeId,
      req.userId,
      status,
    );

    return res.status(200).json({
      message: "Anime status updated successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Update anime status error:", error);

    if (error instanceof Error && error.message === "Anime not found.") {
      return res.status(404).json({
        message: "Anime not found.",
      });
    }

    if (
      error instanceof Error &&
      (error.message === "Invalid anime ID." ||
        error.message === "Invalid user ID." ||
        error.message === "Invalid anime status.")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to update anime status. Please try again.",
    });
  }
};
