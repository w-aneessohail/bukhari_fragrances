import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional()
});

export const productReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["newest", "highest", "lowest", "helpful"]).default("newest")
});

export const reviewIdParamsSchema = z.object({
  id: z.string().min(1)
});

export const productIdParamsSchema = z.object({
  productId: z.string().min(1)
});
