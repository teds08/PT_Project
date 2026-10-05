import { pool } from "../utils/db";
import type { CreatedAnime } from "../interface/create-anime.interface";
import type { UpdateAnimeData } from "../interface/update-anime.interface";

export class UpdateAnimeRepository {
  async findByIdAndUserId(
    animeId: number,
    userId: number,
  ): Promise<CreatedAnime | null> {
    const result = await pool.query<CreatedAnime>(
      `
        SELECT
          id,
          user_id,
          title,
          description,
          image_url,
          image_public_id,
          episodes,
          progress,
          status,
          is_favorite,
          website_url,
          created_at,
          updated_at
        FROM anime_list
        WHERE id = $1
          AND user_id = $2
      `,
      [animeId, userId],
    );

    return result.rows[0] ?? null;
  }

  async update(
    animeId: number,
    userId: number,
    data: UpdateAnimeData,
  ): Promise<CreatedAnime | null> {
    const result = await pool.query<CreatedAnime>(
      `
        UPDATE anime_list
        SET
          title = $1,
          description = $2,
          image_url = $3,
          image_public_id = $4,
          episodes = $5,
          status = $6,
          is_favorite = $7,
          website_url = $8,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
          AND user_id = $10
        RETURNING
          id,
          user_id,
          title,
          description,
          image_url,
          image_public_id,
          episodes,
          progress,
          status,
          is_favorite,
          website_url,
          created_at,
          updated_at
      `,
      [
        data.title,
        data.description,
        data.image_url,
        data.image_public_id,
        data.episodes,
        data.status,
        data.is_favorite,
        data.website_url,
        animeId,
        userId,
      ],
    );

    return result.rows[0] ?? null;
  }

  async updateProgress(
    animeId: number,
    userId: number,
    progress: number,
    status: "Watching" | "Completed" | "Plan to Watch",
  ): Promise<CreatedAnime | null> {
    const result = await pool.query<CreatedAnime>(
      `
        UPDATE anime_list
        SET
          progress = $1,
          status = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
          AND user_id = $4
        RETURNING
          id,
          user_id,
          title,
          description,
          image_url,
          image_public_id,
          episodes,
          progress,
          status,
          is_favorite,
          website_url,
          created_at,
          updated_at
      `,
      [progress, status, animeId, userId],
    );

    return result.rows[0] ?? null;
  }

  async updateFavorite(
    animeId: number,
    userId: number,
    isFavorite: boolean,
  ): Promise<CreatedAnime | null> {
    const result = await pool.query<CreatedAnime>(
      `
        UPDATE anime_list
        SET
          is_favorite = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
          AND user_id = $3
        RETURNING
          id,
          user_id,
          title,
          description,
          image_url,
          image_public_id,
          episodes,
          progress,
          status,
          is_favorite,
          website_url,
          created_at,
          updated_at
      `,
      [isFavorite, animeId, userId],
    );

    return result.rows[0] ?? null;
  }

  async updateStatus(
    animeId: number,
    userId: number,
    progress: number,
    status: "Watching" | "Completed" | "Plan to Watch" | "On Hold" | "Dropped",
  ): Promise<CreatedAnime | null> {
    const result = await pool.query<CreatedAnime>(
      `
        UPDATE anime_list
        SET
          progress = $1,
          status = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
          AND user_id = $4
        RETURNING
          id,
          user_id,
          title,
          description,
          image_url,
          image_public_id,
          episodes,
          progress,
          status,
          is_favorite,
          website_url,
          created_at,
          updated_at
      `,
      [progress, status, animeId, userId],
    );

    return result.rows[0] ?? null;
  }
}
