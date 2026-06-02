import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { HttpError } from "../utils/httpError.js";

function validateWithSchema<T>(schema: ZodSchema<T>, data: unknown, source: "body" | "query" | "params") {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new HttpError(`Invalid request ${source}`, 400, result.error.flatten());
  }

  return result.data;
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = validateWithSchema(schema, req.body, "body");
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = validateWithSchema(schema, req.query, "query") as Request["query"];
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.params = validateWithSchema(schema, req.params, "params") as Request["params"];
      next();
    } catch (error) {
      next(error);
    }
  };
}
