import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env.js";

export type AccessTokenPayload = {
  userId: string;
  role: UserRole;
  email: string;
};

export function generateAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN
  } as SignOptions);
}

export function generateRefreshToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET as Secret, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN
  } as SignOptions);
}

export function verifyToken<T>(token: string, secret: string): T {
  return jwt.verify(token, secret) as T;
}

export function verifyAccessToken(token: string) {
  return verifyToken<AccessTokenPayload>(token, env.JWT_SECRET);
}
