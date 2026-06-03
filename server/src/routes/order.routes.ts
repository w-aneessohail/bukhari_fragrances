import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import { createOrderSchema, orderIdParamsSchema } from "../validators/order.validator.js";
import {
  checkoutSummary,
  cancelOrder,
  createOrder,
  getOrder,
  listOrders,
  trackOrder
} from "../controllers/order.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(verifyAccessToken);

router.get("/checkout/summary", asyncHandler(checkoutSummary));
router.post("/", validateBody(createOrderSchema), asyncHandler(createOrder));
router.get("/", asyncHandler(listOrders));
router.get("/:id/track", validateParams(orderIdParamsSchema), asyncHandler(trackOrder));
router.post("/:id/cancel", validateParams(orderIdParamsSchema), asyncHandler(cancelOrder));
router.get("/:id", validateParams(orderIdParamsSchema), asyncHandler(getOrder));

export default router;
