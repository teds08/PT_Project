import { Request, Response } from "express";

import { AuthService } from "../../services/auth.service";
import { loginSchema } from "../../validations/auth.validation";

const authService = new AuthService();

export const login = async (req: Request, res: Response): Promise<Response> => {
  const validatedData = loginSchema.parse(req.body);

  const result = await authService.login(validatedData);

  return res.status(200).json({
    message: "Login successful.",
    data: result,
  });
};
