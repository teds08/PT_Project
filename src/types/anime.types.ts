export type AnimeStatus =
  | "Watching"
  | "Completed"
  | "Plan to Watch"
  | "On Hold"
  | "Dropped";

export interface Anime {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  episodes: number;
  progress: number;
  status: AnimeStatus;
  is_favorite: boolean;
  website_url: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAnimeData {
  user_id: number;
  title: string;
  description?: string | null;
  image_url?: string | null;
  episodes: number;
  status?: AnimeStatus;
  is_favorite?: boolean;
  website_url?: string | null;
}

export interface UpdateAnimeData {
  title?: string;
  description?: string | null;
  image_url?: string | null;
  episodes?: number;
  status?: AnimeStatus;
  is_favorite?: boolean;
  website_url?: string | null;
}
