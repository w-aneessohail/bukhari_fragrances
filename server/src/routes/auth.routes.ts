import { Router, type RequestHandler } from "express";
import passport from "passport";
import { z } from "zod";
import { authLimiter } from "../middleware/rateLimiter.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  forgotPasswordController,
  googleCallback,
  login,
  logout,
  refresh,
  register,
  resetPasswordController,
  verifyEmailController
} from "../controllers/auth.controller.js";
import { getMe } from "../controllers/user.controller.js";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(80),
  password: z.string().min(8).max(120)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(120)
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  password: z.string().min(8).max(120)
});

const tokenParamsSchema = z.object({
  token: z.string().min(1)
});

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.post("/register", authLimiter, validateBody(registerSchema), asyncHandler(register));
router.post("/login", authLimiter, validateBody(loginSchema), asyncHandler(login));
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/api/auth/login" }),
  asyncHandler(googleCallback)
);
router.post("/refresh", asyncHandler(refresh));
router.get("/me", verifyAccessToken, asyncHandler(getMe));
router.post("/logout", verifyAccessToken, asyncHandler(logout));
router.post(
  "/forgot-password",
  authLimiter,
  validateBody(forgotPasswordSchema),
  asyncHandler(forgotPasswordController)
);
router.post(
  "/reset-password/:token",
  authLimiter,
  validateParams(tokenParamsSchema),
  validateBody(resetPasswordSchema),
  asyncHandler(resetPasswordController)
);
router.get("/verify-email/:token", validateParams(tokenParamsSchema), asyncHandler(verifyEmailController));

export default router;
