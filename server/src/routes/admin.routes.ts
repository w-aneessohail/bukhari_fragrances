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
  listOrders,
  listUsersController,
  patchOrderStatus
} from "../controllers/admin.controller.js";
import { createBlogPostSchema, blogIdParamsSchema } from "../validators/blog.validator.js";
import { adminCreate, adminDelete, adminList } from "../controllers/blog.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(verifyAccessToken, requireAdmin);

router.get("/stats", asyncHandler(dashboardStats));
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

export default router;
