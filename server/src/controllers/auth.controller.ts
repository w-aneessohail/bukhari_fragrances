import type { Request, Response } from "express";
import { env } from "../config/env.js";
import { ApiResponse } from "../utils/response.utils.js";
import {
  forgotPassword,
  loginUser,
  loginWithGoogleProfile,
  logoutUser,
  refreshUserSession,
  registerUser,
  resetPassword,
  verifyEmail
} from "../services/auth.service.js";
import { HttpError } from "../utils/httpError.js";

const ACCESS_TOKEN_COOKIE = "access_token";
const REFRESH_TOKEN_COOKIE = "refresh_token";

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  const secure = process.env.NODE_ENV === "production";

  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    maxAge: 15 * 60 * 1000
  });

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE);
  res.clearCookie(REFRESH_TOKEN_COOKIE);
}

export async function register(req: Request, res: Response) {
  const { email, name, password } = req.body;
  const session = await registerUser(email, name, password);

  setAuthCookies(res, session.accessToken, session.refreshToken);
  res.status(201).json(
    new ApiResponse({
      success: true,
      message: "Registration successful",
      data: { user: session.user, accessToken: session.accessToken }
    })
  );
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const session = await loginUser(email, password);

  setAuthCookies(res, session.accessToken, session.refreshToken);
  res.json(
    new ApiResponse({
      success: true,
      message: "Login successful",
      data: { user: session.user, accessToken: session.accessToken }
    })
  );
}

export async function googleCallback(req: Request, res: Response) {
  if (!req.user) {
    throw new HttpError("Google authentication failed", 401);
  }

  const session = await loginWithGoogleProfile(req.user);
  setAuthCookies(res, session.accessToken, session.refreshToken);

  res.redirect(env.FRONTEND_URL);
}

export async function refresh(req: Request, res: Response) {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
  if (!refreshToken) {
    throw new HttpError("Refresh token is required", 401);
  }

  const session = await refreshUserSession(refreshToken);
  setAuthCookies(res, session.accessToken, session.refreshToken);
  res.json(
    new ApiResponse({
      success: true,
      message: "Session refreshed",
      data: { user: session.user, accessToken: session.accessToken }
    })
  );
}

export async function logout(req: Request, res: Response) {
  if (req.user?.userId) {
    await logoutUser(req.user.userId);
  }

  clearAuthCookies(res);
  res.json(new ApiResponse({ success: true, message: "Logout successful" }));
}

export async function forgotPasswordController(req: Request, res: Response) {
  await forgotPassword(req.body.email);
  res.json(new ApiResponse({ success: true, message: "If the account exists, a reset email was sent" }));
}

export async function resetPasswordController(req: Request, res: Response) {
  await resetPassword(req.params.token, req.body.password);
  res.json(new ApiResponse({ success: true, message: "Password reset successful" }));
}

export async function verifyEmailController(req: Request, res: Response) {
  await verifyEmail(req.params.token);
  res.json(new ApiResponse({ success: true, message: "Email verified successfully" }));
}
