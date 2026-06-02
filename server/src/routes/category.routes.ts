import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  categoryIdParamsSchema,
  categorySlugParamsSchema,
  createCategorySchema,
  updateCategorySchema
} from "../validators/category.validator.js";
import {
  createCategoryController,
  deleteCategoryController,
  getCategory,
  listCategories,
  updateCategoryController
} from "../controllers/category.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.get("/", asyncHandler(listCategories));
router.get("/:slug", validateParams(categorySlugParamsSchema), asyncHandler(getCategory));

router.post("/", verifyAccessToken, requireAdmin, validateBody(createCategorySchema), asyncHandler(createCategoryController));
router.put(
  "/:id",
  verifyAccessToken,
  requireAdmin,
  validateParams(categoryIdParamsSchema),
  validateBody(updateCategorySchema),
  asyncHandler(updateCategoryController)
);
router.delete(
  "/:id",
  verifyAccessToken,
  requireAdmin,
  validateParams(categoryIdParamsSchema),
  asyncHandler(deleteCategoryController)
);

export default router;
