import { Router, type RequestHandler } from "express";
import { validateBody } from "../middleware/validate.middleware.js";
import { contactMessageSchema, newsletterSubscribeSchema } from "../validators/contact.validator.js";
import { submitContact, subscribeNewsletter } from "../controllers/contact.controller.js";
import { generalLimiter } from "../middleware/rateLimiter.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.post("/", generalLimiter, validateBody(contactMessageSchema), asyncHandler(submitContact));
router.post("/subscribe", generalLimiter, validateBody(newsletterSubscribeSchema), asyncHandler(subscribeNewsletter));

export default router;
