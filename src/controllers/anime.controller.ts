import { Request, Response } from "express";

import { createAnime } from "./handlers/create-anime.handler";
import { updateAnime } from "./handlers/update-anime.handler";
import { updateAnimeProgress } from "./handlers/update-anime-progress.handler";
import { updateAnimeFavorite } from "./handlers/update-anime-favorite.handler";
import { updateAnimeStatus } from "./handlers/update-anime-status.handler";
import { deleteAnime } from "./handlers/delete-anime.handler";
import { getAnime } from "./handlers/get-anime.handler";
import { getAnimeById } from "./handlers/get-anime-by-id.handler";

export class AnimeController {
  async create(req: Request, res: Response) {
    return createAnime(req, res);
  }

  async update(req: Request, res: Response) {
    return updateAnime(req, res);
  }

  async updateProgress(req: Request, res: Response) {
    return updateAnimeProgress(req, res);
  }

  async updateFavorite(req: Request, res: Response) {
    return updateAnimeFavorite(req, res);
  }

  async updateStatus(req: Request, res: Response) {
    return updateAnimeStatus(req, res);
  }

  async delete(req: Request, res: Response) {
    return deleteAnime(req, res);
  }

  async get(req: Request, res: Response) {
    return getAnime(req, res);
  }

  async getById(req: Request, res: Response) {
    return getAnimeById(req, res);
  }
}
