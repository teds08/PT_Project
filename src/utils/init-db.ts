import { pool } from "./db";

export const initDatabase = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(`
      CREATE TABLE IF NOT EXISTS anime_list (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        image_url TEXT,
        image_public_id TEXT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        episodes INTEGER NOT NULL,
        progress INTEGER NOT NULL DEFAULT 0,
        status VARCHAR(30) NOT NULL DEFAULT 'Plan to Watch',
        is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
        website_url TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT anime_list_episodes_positive
          CHECK (episodes > 0),

        CONSTRAINT anime_list_progress_valid
          CHECK (progress >= 0 AND progress <= episodes),

        CONSTRAINT anime_list_status_valid
          CHECK (
            status IN (
              'Watching',
              'Completed',
              'Plan to Watch',
              'On Hold',
              'Dropped'
            )
          )
      )
    `);

    await client.query("COMMIT");

    console.log("Database initialized successfully.");
    console.log("anime_list table is ready.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Database initialization failed:", error);
    throw error;
  } finally {
    client.release();
  }
};
