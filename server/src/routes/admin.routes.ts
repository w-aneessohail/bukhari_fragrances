import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.middleware.js";
import {
  adminListQuerySchema,
  orderIdParamsSchema,
  updateOrderStatusSchema
} from "../validators/admin.validator.js";
import {
  dashboardStats,
  listAdminProducts,
  listOrders,
  listUsersController,
  patchOrderStatus
} from "../controllers/admin.controller.js";
import { createProductSchema, productIdParamsSchema, updateProductSchema } from "../validators/product.validator.js";
import {
  createProductController,
  deleteProductController,
  updateProductController,
  uploadImagesController
} from "../controllers/product.controller.js";
import { uploadMultipleDynamic } from "../middleware/upload.middleware.js";
import { createBlogPostSchema, blogIdParamsSchema } from "../validators/blog.validator.js";
import { adminCreate, adminDelete, adminList } from "../controllers/blog.controller.js";
import {
  createDiscountSchema,
  discountIdParamsSchema,
  updateDiscountSchema
} from "../services/discount.service.js";
import {
  createDiscountController,
  deleteDiscountController,
  listDiscountsController,
  updateDiscountController
} from "../controllers/discount.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(verifyAccessToken, requireAdmin);

router.get("/stats", asyncHandler(dashboardStats));
router.get("/products", validateQuery(adminListQuerySchema), asyncHandler(listAdminProducts));
router.post("/products", validateBody(createProductSchema), asyncHandler(createProductController));
router.put(
  "/products/:id",
  validateParams(productIdParamsSchema),
  validateBody(updateProductSchema),
  asyncHandler(updateProductController)
);
router.delete(
  "/products/:id",
  validateParams(productIdParamsSchema),
  asyncHandler(deleteProductController)
);
router.post(
  "/products/:id/images",
  validateParams(productIdParamsSchema),
  uploadMultipleDynamic((req) => `products/${req.params.id}`),
  asyncHandler(uploadImagesController)
);
router.get("/orders", validateQuery(adminListQuerySchema), asyncHandler(listOrders));
router.patch(
  "/orders/:id/status",
  validateParams(orderIdParamsSchema),
  validateBody(updateOrderStatusSchema),
  asyncHandler(patchOrderStatus)
);
router.get("/users", validateQuery(adminListQuerySchema), asyncHandler(listUsersController));

router.get("/blog", asyncHandler(adminList));
router.post("/blog", validateBody(createBlogPostSchema), asyncHandler(adminCreate));
router.delete("/blog/:id", validateParams(blogIdParamsSchema), asyncHandler(adminDelete));

router.get("/discounts", asyncHandler(listDiscountsController));
router.post("/discounts", validateBody(createDiscountSchema), asyncHandler(createDiscountController));
router.patch(
  "/discounts/:id",
  validateParams(discountIdParamsSchema),
  validateBody(updateDiscountSchema),
  asyncHandler(updateDiscountController)
);
router.delete(
  "/discounts/:id",
  validateParams(discountIdParamsSchema),
  asyncHandler(deleteDiscountController)
);

export default router;
