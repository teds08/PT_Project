export interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}
