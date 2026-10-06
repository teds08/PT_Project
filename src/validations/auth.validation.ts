import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long.")
    .max(100, "Username must not exceed 100 characters."),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255, "Email must not exceed 255 characters.")
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .max(100, "Password must not exceed 100 characters."),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(255, "Email must not exceed 255 characters.")
    .transform((value) => value.toLowerCase()),

  password: z.string().min(1, "Password is required."),
});
