import { Router, type RequestHandler } from "express";
import { validateParams } from "../middleware/validate.middleware.js";
import { blogSlugParamsSchema } from "../validators/blog.validator.js";
import { getBySlug, listPublished } from "../controllers/blog.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.get("/", asyncHandler(listPublished));
router.get("/:slug", validateParams(blogSlugParamsSchema), asyncHandler(getBySlug));

export default router;
