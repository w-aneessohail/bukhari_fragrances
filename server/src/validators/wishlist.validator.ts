import { z } from "zod";

export const wishlistProductParamsSchema = z.object({
  productId: z.string().min(1)
});

export const addWishlistSchema = z.object({
  productId: z.string().min(1)
});
