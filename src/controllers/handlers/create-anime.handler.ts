import { Request, Response } from "express";

import { CreateAnimeService } from "../../services/create-anime.service";
import { createAnimeSchema } from "../../validations/create-anime.validation";

const createAnimeService = new CreateAnimeService();

export const createAnime = async (req: Request, res: Response) => {
  const validation = createAnimeSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      message: "Validation failed.",
      errors: validation.error.issues,
    });
  }

  const { title, description, episodes, status, is_favorite, website_url } =
    validation.data;

  if (status === "Completed") {
    return res.status(400).json({
      message:
        "New anime must start with zero progress. Update its progress to mark it completed.",
    });
  }

  try {
    const anime = await createAnimeService.execute(
      {
        user_id: req.userId,
        title,
        description,
        episodes,
        status,
        is_favorite,
        website_url,
      },
      req.file?.buffer,
    );

    return res.status(201).json({
      message: "Anime created successfully.",
      data: anime,
    });
  } catch (error: unknown) {
    console.error("Create anime error:", error);

    return res.status(500).json({
      message: "Failed to create anime. Please try again.",
    });
  }
};
