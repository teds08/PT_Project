import bcrypt from "bcrypt";

import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from "../interface/auth.interface";
import { AuthRepository } from "../repositories/auth.repository";
import { generateToken } from "../utils/jwt";

const SALT_ROUNDS = 10;

export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterInput): Promise<AuthResponse> {
    const username = data.username.trim();
    const email = data.email.trim().toLowerCase();

    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await this.authRepository.create(
      username,
      email,
      hashedPassword,
    );

    const token = generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const email = data.email.trim().toLowerCase();

    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new Error("Invalid email or password.");
    }

    const token = generateToken(user.id);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  }
}
