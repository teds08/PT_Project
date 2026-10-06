import { Router } from "express";

import { AnimeController } from "../controllers/anime.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import uploadAnimeImage from "../middleware/uploadAnimeImage";

const router = Router();
const animeController = new AnimeController();

router.use(authMiddleware);

router.post("/create", uploadAnimeImage, (req, res) =>
  animeController.create(req, res),
);

router.get("/", (req, res) => animeController.get(req, res));

router.patch("/:id/progress", (req, res) =>
  animeController.updateProgress(req, res),
);

router.patch("/:id/favorite", (req, res) =>
  animeController.updateFavorite(req, res),
);

router.put("/:id", uploadAnimeImage, (req, res) =>
  animeController.update(req, res),
);

router.delete("/:id", (req, res) => animeController.delete(req, res));

router.patch("/:id/status", (req, res) =>
  animeController.updateStatus(req, res),
);

export default router;
