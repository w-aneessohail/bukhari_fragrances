import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  addWishlistSchema,
  wishlistProductParamsSchema
} from "../validators/wishlist.validator.js";
import {
  addWishlistItem,
  checkWishlistItem,
  listWishlist,
  removeWishlistItem
} from "../controllers/wishlist.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(verifyAccessToken);

router.get("/", asyncHandler(listWishlist));
router.get("/check/:productId", validateParams(wishlistProductParamsSchema), asyncHandler(checkWishlistItem));
router.post("/", validateBody(addWishlistSchema), asyncHandler(addWishlistItem));
router.delete("/:productId", validateParams(wishlistProductParamsSchema), asyncHandler(removeWishlistItem));

export default router;
