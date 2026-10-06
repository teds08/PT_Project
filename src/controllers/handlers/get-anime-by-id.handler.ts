import { Request, Response } from "express";

import { GetAnimeService } from "../../services/get-anime.service";

const getAnimeService = new GetAnimeService();

export const getAnimeById = async (req: Request, res: Response) => {
  const animeId = Number(req.params.id);

  if (!Number.isInteger(animeId) || animeId <= 0) {
    return res.status(400).json({
      message: "Invalid anime ID.",
    });
  }

  try {
    const anime = await getAnimeService.executeById(animeId, req.userId);

    return res.status(200).json({
      message: "Anime retrieved successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Get anime by ID error:", error);

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
      message: "Failed to retrieve anime. Please try again.",
    });
  }
};
