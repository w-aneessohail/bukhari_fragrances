import { z } from "zod";

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  sizeId: z.string().min(1).optional().nullable(),
  quantity: z.coerce.number().int().min(1).max(99).default(1)
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99)
});

export const cartItemParamsSchema = z.object({
  itemId: z.string().min(1)
});

export const applyDiscountSchema = z.object({
  code: z.string().trim().min(1).max(50)
});
