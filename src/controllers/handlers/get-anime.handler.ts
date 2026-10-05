import { Request, Response } from "express";

import { GetAnimeService } from "../../services/get-anime.service";

const getAnimeService = new GetAnimeService();

const DEV_USER_ID = 1;

export const getAnime = async (_req: Request, res: Response) => {
  try {
    const anime = await getAnimeService.execute(DEV_USER_ID);

    return res.status(200).json({
      message: "Anime retrieved successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Get anime error:", error);

    if (error instanceof Error && error.message === "Invalid user ID.") {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Failed to retrieve anime. Please try again.",
    });
  }
};
