import type { AnimeStatus, CreatedAnime } from "./create-anime.interface";

export interface UpdateAnimeInput {
  title?: string;
  description?: string | null;
  episodes?: number;
  status?: AnimeStatus;
  is_favorite?: boolean;
  website_url?: string | null;
}

export interface UpdateAnimeData extends UpdateAnimeInput {
  image_url?: string | null;
  image_public_id?: string | null;
}

export interface UpdateAnimeResult extends CreatedAnime {}
