import { pool } from "../utils/db";
import type { AuthUser } from "../interface/auth.interface";

interface AuthUserRecord extends AuthUser {
  password: string;
}

export class AuthRepository {
  async findByEmail(email: string): Promise<AuthUserRecord | null> {
    const result = await pool.query<AuthUserRecord>(
      `
        SELECT
          id,
          username,
          email,
          password
        FROM users
        WHERE email = $1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findById(id: number): Promise<AuthUser | null> {
    const result = await pool.query<AuthUser>(
      `
        SELECT
          id,
          username,
          email
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    return result.rows[0] ?? null;
  }

  async create(
    username: string,
    email: string,
    password: string,
  ): Promise<AuthUser> {
    const result = await pool.query<AuthUser>(
      `
        INSERT INTO users (
          username,
          email,
          password
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          username,
          email
      `,
      [username, email, password],
    );

    return result.rows[0];
  }
}
