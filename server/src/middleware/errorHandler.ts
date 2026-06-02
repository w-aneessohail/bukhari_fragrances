import type { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/response.utils.js";

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = error instanceof Error ? error.message : "Internal server error";

  res.status(500).json(
    new ApiResponse({
      success: false,
      message
    })
  );
}
