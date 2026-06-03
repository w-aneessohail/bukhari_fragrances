import { z } from "zod";

export const createScentDiarySchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  mood: z.string().max(80).optional(),
  occasion: z.string().max(120).optional(),
  notes: z.string().max(1000).optional(),
  dateWorn: z.coerce.date()
});

export const updateScentDiarySchema = createScentDiarySchema.partial().omit({ productId: true });

export const scentDiaryIdParamsSchema = z.object({
  id: z.string().min(1)
});
