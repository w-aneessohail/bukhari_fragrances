import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { logger } from "./logger.middleware.js";
import { ApiResponse } from "../utils/response.utils.js";
import { HttpError } from "../utils/httpError.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";
  let details: unknown;

  if (error instanceof HttpError) {
    statusCode = error.statusCode;
    message = error.message;
    details = error.details;
  } else if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    details = error.flatten();
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "A record with this value already exists";
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "Record not found";
    } else {
      message = "Database request failed";
    }
  } else if (error instanceof jwt.TokenExpiredError) {
    statusCode = 401;
    message = "Token expired";
  } else if (error instanceof jwt.JsonWebTokenError) {
    statusCode = 401;
    message = "Invalid token";
  } else if (error instanceof Error) {
    message = error.message;
  }

  if (env.NODE_ENV === "production") {
    logger.error(message, { statusCode, details, stack: error instanceof Error ? error.stack : undefined });
  } else {
    console.error(error);
  }

  res.status(statusCode).json(
    new ApiResponse({
      success: false,
      message,
      data: details
    })
  );
}
