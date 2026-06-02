import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError.js";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (!req.user) {
    return next(new HttpError("Authentication required", 401));
  }

  if (req.user.role !== "ADMIN" && req.user.role !== "SUPER_ADMIN") {
    return next(new HttpError("Admin access required", 403));
  }

  next();
}
