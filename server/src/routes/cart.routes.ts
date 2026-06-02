import { Router, type RequestHandler } from "express";
import { optionalAuth } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  addCartItemSchema,
  cartItemParamsSchema,
  updateCartItemSchema
} from "../validators/cart.validator.js";
import {
  addCartItemController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController
} from "../controllers/cart.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(optionalAuth);

router.get("/", asyncHandler(getCartController));
router.post("/items", validateBody(addCartItemSchema), asyncHandler(addCartItemController));
router.patch(
  "/items/:itemId",
  validateParams(cartItemParamsSchema),
  validateBody(updateCartItemSchema),
  asyncHandler(updateCartItemController)
);
router.delete(
  "/items/:itemId",
  validateParams(cartItemParamsSchema),
  asyncHandler(removeCartItemController)
);
router.delete("/", asyncHandler(clearCartController));

export default router;
