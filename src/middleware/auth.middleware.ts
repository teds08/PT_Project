import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      res.status(401).json({
        message: "Authentication required.",
      });
      return;
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      res.status(401).json({
        message: "Invalid authorization format.",
      });
      return;
    }

    const payload = verifyToken(token);

    req.userId = payload.userId;

    next();
  } catch {
    res.status(401).json({
      message: "Invalid or expired authentication token.",
    });
  }
};
