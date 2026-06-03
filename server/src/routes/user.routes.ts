import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  addressIdParamsSchema,
  addressSchema,
  changePasswordSchema
} from "../validators/user.validator.js";
import {
  changePasswordController,
  createAddressController,
  deleteAddressController,
  getMe,
  listAddressesController,
  loyaltySummaryController,
  updateAddressController
} from "../controllers/user.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(verifyAccessToken);

router.get("/me", asyncHandler(getMe));
router.get("/loyalty", asyncHandler(loyaltySummaryController));
router.post("/change-password", validateBody(changePasswordSchema), asyncHandler(changePasswordController));
router.get("/addresses", asyncHandler(listAddressesController));
router.post("/addresses", validateBody(addressSchema), asyncHandler(createAddressController));
router.patch(
  "/addresses/:id",
  validateParams(addressIdParamsSchema),
  validateBody(addressSchema.partial()),
  asyncHandler(updateAddressController)
);
router.delete(
  "/addresses/:id",
  validateParams(addressIdParamsSchema),
  asyncHandler(deleteAddressController)
);

export default router;
