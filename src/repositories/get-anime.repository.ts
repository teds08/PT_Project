import { pool } from "../utils/db";
import type { CreatedAnime } from "../interface/create-anime.interface";

export class GetAnimeRepository {
  async findAllByUserId(userId: number): Promise<CreatedAnime[]> {
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
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    );

    return result.rows;
  }

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
}
