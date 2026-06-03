import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  jazzCashCallbackSchema,
  jazzCashInitiateSchema,
  stripeIntentSchema
} from "../validators/payment.validator.js";
import {
  jazzCashCallbackController,
  jazzCashInitiateController,
  stripeIntentController
} from "../controllers/payment.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.post(
  "/jazzcash/callback",
  validateBody(jazzCashCallbackSchema),
  asyncHandler(jazzCashCallbackController)
);

router.use(verifyAccessToken);

router.post("/stripe/intent", validateBody(stripeIntentSchema), asyncHandler(stripeIntentController));
router.post(
  "/jazzcash/initiate",
  validateBody(jazzCashInitiateSchema),
  asyncHandler(jazzCashInitiateController)
);

export default router;
