import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { defaultFromEmail, emailTransporter } from "../config/email.js";
import { HttpError } from "../utils/httpError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../utils/jwt.utils.js";

type SanitizedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isVerified: boolean;
};

type AuthSession = {
  user: SanitizedUser;
  accessToken: string;
  refreshToken: string;
};

const PASSWORD_SALT_ROUNDS = 12;

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isVerified: boolean;
}): SanitizedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isVerified: user.isVerified
  };
}

async function hashToken(token: string) {
  return bcrypt.hash(token, PASSWORD_SALT_ROUNDS);
}

async function createSession(user: {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string | null;
  isVerified: boolean;
}): Promise<AuthSession> {
  const payload = {
    userId: user.id,
    role: user.role,
    email: user.email
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  const refreshTokenHash = await hashToken(refreshToken);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken: refreshTokenHash }
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken
  };
}

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await emailTransporter.sendMail({
      from: defaultFromEmail,
      to,
      subject,
      html
    });
  } catch (error) {
    if (env.NODE_ENV === "production") {
      throw error;
    }
    console.warn("Email delivery skipped in local environment.");
  }
}

export async function registerUser(email: string, name: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new HttpError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role: "CUSTOMER"
    }
  });

  const verificationToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "24h" });
  const verificationLink = `${env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  await sendEmail(
    user.email,
    "Verify your Bukhari Perfumes account",
    `<p>Welcome to Bukhari Perfumes.</p><p>Verify your account: <a href="${verificationLink}">${verificationLink}</a></p>`
  );

  return createSession(user);
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) {
    throw new HttpError("Invalid credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError("Invalid credentials", 401);
  }

  return createSession(user);
}

export async function loginWithGoogleProfile(profile: Express.User) {
  const user = await prisma.user.findUnique({
    where: { id: profile.userId }
  });

  if (!user) {
    throw new HttpError("Google account user not found", 404);
  }

  return createSession(user);
}

export async function refreshUserSession(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user?.refreshToken) {
    throw new HttpError("Session expired", 401);
  }

  const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
  if (!tokenMatches) {
    throw new HttpError("Invalid refresh token", 401);
  }

  return createSession(user);
}

export async function logoutUser(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null }
  });
}

export async function forgotPassword(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }

  const resetToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: "1h" });
  const resetLink = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

  await sendEmail(
    user.email,
    "Reset your Bukhari Perfumes password",
    `<p>Use this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`
  );
}

export async function resetPassword(token: string, newPassword: string) {
  const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
  const passwordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);

  await prisma.user.update({
    where: { id: decoded.userId },
    data: {
      passwordHash,
      refreshToken: null
    }
  });
}

export async function verifyEmail(token: string) {
  const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };
  await prisma.user.update({
    where: { id: decoded.userId },
    data: { isVerified: true }
  });
}
