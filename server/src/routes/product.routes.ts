import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.middleware.js";
import { uploadMultipleDynamic } from "../middleware/upload.middleware.js";
import {
  createProductSchema,
  productIdParamsSchema,
  productListQuerySchema,
  productSlugParamsSchema,
  updateProductSchema
} from "../validators/product.validator.js";
import {
  createProductController,
  deleteProductController,
  getBestsellers,
  getBySlug,
  getFeatured,
  getNewArrivals,
  listProducts,
  updateProductController,
  uploadImagesController
} from "../controllers/product.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.get("/", validateQuery(productListQuerySchema), asyncHandler(listProducts));
router.get("/featured", asyncHandler(getFeatured));
router.get("/bestsellers", asyncHandler(getBestsellers));
router.get("/new-arrivals", asyncHandler(getNewArrivals));
router.get("/:slug", validateParams(productSlugParamsSchema), asyncHandler(getBySlug));

router.post(
  "/",
  verifyAccessToken,
  requireAdmin,
  validateBody(createProductSchema),
  asyncHandler(createProductController)
);

router.put(
  "/:id",
  verifyAccessToken,
  requireAdmin,
  validateParams(productIdParamsSchema),
  validateBody(updateProductSchema),
  asyncHandler(updateProductController)
);

router.delete(
  "/:id",
  verifyAccessToken,
  requireAdmin,
  validateParams(productIdParamsSchema),
  asyncHandler(deleteProductController)
);

router.post(
  "/:id/images",
  verifyAccessToken,
  requireAdmin,
  validateParams(productIdParamsSchema),
  uploadMultipleDynamic((req) => `products/${req.params.id}`),
  asyncHandler(uploadImagesController)
);

export default router;
