import { pool } from "../utils/db";
import type {
  CreateAnimeData,
  CreatedAnime,
} from "../interface/create-anime.interface";

export class CreateAnimeRepository {
  async create(data: CreateAnimeData): Promise<CreatedAnime> {
    const result = await pool.query<CreatedAnime>(
      `
        INSERT INTO anime_list (
          user_id,
          title,
          description,
          image_url,
          image_public_id,
          episodes,
          status,
          is_favorite,
          website_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
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
        data.user_id,
        data.title,
        data.description,
        data.image_url,
        data.image_public_id,
        data.episodes,
        data.status,
        data.is_favorite,
        data.website_url,
      ],
    );

    return result.rows[0];
  }
}
