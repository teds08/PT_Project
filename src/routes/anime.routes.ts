import { Router } from "express";

import { AnimeController } from "../controllers/anime.controller";
import uploadAnimeImage from "../middleware/uploadAnimeImage";

const router = Router();
const animeController = new AnimeController();

router.post("/create", uploadAnimeImage, (req, res) =>
  animeController.create(req, res),
);

export default router;
