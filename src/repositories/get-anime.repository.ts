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
}
