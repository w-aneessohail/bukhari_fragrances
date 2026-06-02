import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";

type JwtPayload = {
  userId: string;
  role: string;
  email: string;
};

export function generateAccessToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN
  } as SignOptions);
}

export function generateRefreshToken(payload: JwtPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  } as SignOptions);
}

export function verifyToken<T>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}
