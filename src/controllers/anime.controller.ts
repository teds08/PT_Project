import { Request, Response } from "express";
import { createAnime } from "./handlers/create-anime.handler";

export class AnimeController {
  async create(req: Request, res: Response) {
    return createAnime(req, res);
  }
}
