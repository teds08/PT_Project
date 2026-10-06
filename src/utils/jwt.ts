import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: number;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
};

export const generateToken = (userId: number): string => {
  return jwt.sign(
    {
      userId,
    },
    getJwtSecret(),
    {
      expiresIn: "1h",
    },
  );
};

export const verifyToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret());

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "number"
  ) {
    throw new Error("Invalid authentication token.");
  }

  return {
    userId: decoded.userId,
  };
};
