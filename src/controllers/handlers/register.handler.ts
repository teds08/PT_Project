import { Request, Response } from "express";

import { AuthService } from "../../services/auth.service";
import { registerSchema } from "../../validations/auth.validation";

const authService = new AuthService();

export const register = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  const validatedData = registerSchema.parse(req.body);

  const result = await authService.register(validatedData);

  return res.status(201).json({
    message: "Registration successful.",
    data: result,
  });
};
