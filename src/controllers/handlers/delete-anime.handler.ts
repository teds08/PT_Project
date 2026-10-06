import { Request, Response } from "express";

import { DeleteAnimeService } from "../../services/delete-anime.service";

const deleteAnimeService = new DeleteAnimeService();

export const deleteAnime = async (req: Request, res: Response) => {
  const animeId = Number(req.params.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return res.status(400).json({
      message: "Invalid anime ID.",
    });
  }

  try {
    await deleteAnimeService.execute(animeId, req.userId);

    return res.status(200).json({
      message: "Anime deleted successfully.",
    });
  } catch (error: unknown) {
    console.error("Delete anime error:", error);

    if (error instanceof Error && error.message === "Anime not found.") {
      return res.status(404).json({
        message: "Anime not found.",
      });
    }

    if (
      error instanceof Error &&
      (error.message === "Invalid anime ID." ||
        error.message === "Invalid user ID.")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to delete anime. Please try again.",
    });
  }
};
