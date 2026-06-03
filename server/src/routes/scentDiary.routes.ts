import { Router, type RequestHandler } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { validateBody, validateParams } from "../middleware/validate.middleware.js";
import {
  createScentDiarySchema,
  scentDiaryIdParamsSchema,
  updateScentDiarySchema
} from "../validators/scentDiary.validator.js";
import {
  createEntry,
  deleteEntry,
  listEntries,
  updateEntry
} from "../controllers/scentDiary.controller.js";

const router = Router();

const asyncHandler = (handler: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};

router.use(verifyAccessToken);

router.get("/", asyncHandler(listEntries));
router.post("/", validateBody(createScentDiarySchema), asyncHandler(createEntry));
router.patch(
  "/:id",
  validateParams(scentDiaryIdParamsSchema),
  validateBody(updateScentDiarySchema),
  asyncHandler(updateEntry)
);
router.delete("/:id", validateParams(scentDiaryIdParamsSchema), asyncHandler(deleteEntry));

export default router;
