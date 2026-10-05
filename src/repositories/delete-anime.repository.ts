import { pool } from "../utils/db";

export interface DeletedAnime {
  id: number;
  user_id: number;
  image_public_id: string | null;
}

export class DeleteAnimeRepository {
  async delete(animeId: number, userId: number): Promise<DeletedAnime | null> {
    const result = await pool.query<DeletedAnime>(
      `
        DELETE FROM anime_list
        WHERE id = $1
          AND user_id = $2
        RETURNING
          id,
          user_id,
          image_public_id
      `,
      [animeId, userId],
    );

    return result.rows[0] ?? null;
  }
}
