import { Router, type RequestHandler } from "express";
import { validateQuery } from "../middleware/validate.middleware.js";
import { searchQuerySchema } from "../validators/product.validator.js";
import { searchProductsController } from "../controllers/product.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.get("/", validateQuery(searchQuerySchema), asyncHandler(searchProductsController));

export default router;
