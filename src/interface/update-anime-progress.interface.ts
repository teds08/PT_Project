import type { CreatedAnime } from "./create-anime.interface";

export interface UpdateAnimeProgressInput {
  progress: number;
}

export interface UpdateAnimeProgressResult extends CreatedAnime {}
