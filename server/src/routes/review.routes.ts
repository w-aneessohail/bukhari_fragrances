import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody, validateParams, validateQuery } from "../middleware/validate.middleware.js";
import {
  createReviewSchema,
  productIdParamsSchema,
  productReviewsQuerySchema,
  reviewIdParamsSchema
} from "../validators/review.validator.js";
import {
  createReviewController,
  deleteReviewController,
  featuredReviewsController,
  listProductReviewsController,
  markHelpfulController,
  myProductReviewController
} from "../controllers/review.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.get("/featured", asyncHandler(featuredReviewsController));
router.get(
  "/product/:productId",
  validateParams(productIdParamsSchema),
  validateQuery(productReviewsQuerySchema),
  asyncHandler(listProductReviewsController)
);

router.use(verifyAccessToken);

router.get(
  "/product/:productId/mine",
  validateParams(productIdParamsSchema),
  asyncHandler(myProductReviewController)
);
router.post("/", validateBody(createReviewSchema), asyncHandler(createReviewController));
router.put("/:id/helpful", validateParams(reviewIdParamsSchema), asyncHandler(markHelpfulController));
router.delete("/:id", validateParams(reviewIdParamsSchema), asyncHandler(deleteReviewController));

export default router;
