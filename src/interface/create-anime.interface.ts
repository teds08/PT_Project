export type AnimeStatus =
  | "Watching"
  | "Completed"
  | "Plan to Watch"
  | "On Hold"
  | "Dropped";

export interface CreateAnimeInput {
  user_id: number;
  title: string;
  description: string | null;
  episodes: number;
  status: AnimeStatus;
  is_favorite: boolean;
  website_url: string | null;
}

export interface CreateAnimeData extends CreateAnimeInput {
  image_url: string | null;
  image_public_id: string | null;
}

export interface CreatedAnime {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  episodes: number;
  progress: number;
  status: AnimeStatus;
  is_favorite: boolean;
  website_url: string | null;
  created_at: Date;
  updated_at: Date;
}
