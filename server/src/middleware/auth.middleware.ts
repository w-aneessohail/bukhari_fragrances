import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken as parseAccessToken, type AccessTokenPayload } from "../utils/jwt.utils.js";
import { HttpError } from "../utils/httpError.js";

const ACCESS_TOKEN_COOKIE = "access_token";

function extractBearerToken(authorizationHeader?: string) {
  if (!authorizationHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice(7).trim();
}

function extractAccessToken(req: Request) {
  const bearerToken = extractBearerToken(req.headers.authorization);
  if (bearerToken) {
    return bearerToken;
  }

  const cookieToken = req.cookies?.[ACCESS_TOKEN_COOKIE];
  return typeof cookieToken === "string" ? cookieToken : null;
}

function attachUser(req: Request, payload: AccessTokenPayload) {
  req.user = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  } as Express.User;
}

export function verifyAccessToken(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractAccessToken(req);

    if (!token) {
      throw new HttpError("Authentication required", 401);
    }

    const payload = parseAccessToken(token);
    attachUser(req, payload);
    next();
  } catch (error) {
    next(error);
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const token = extractAccessToken(req);

    if (!token) {
      return next();
    }

    const payload = parseAccessToken(token);
    attachUser(req, payload);
    next();
  } catch {
    next();
  }
}
