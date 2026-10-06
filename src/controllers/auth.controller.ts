import { Request, Response } from "express";

import { login } from "./handlers/login.handler";
import { register } from "./handlers/register.handler";

export class AuthController {
  async register(req: Request, res: Response) {
    return register(req, res);
  }

  async login(req: Request, res: Response) {
    return login(req, res);
  }
}
