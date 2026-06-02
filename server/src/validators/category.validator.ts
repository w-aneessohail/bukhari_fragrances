import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).optional(),
  description: z.string().max(1000).optional().nullable(),
  image: z.string().url().optional().nullable(),
  parentId: z.string().min(1).optional().nullable()
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamsSchema = z.object({
  id: z.string().min(1)
});

export const categorySlugParamsSchema = z.object({
  slug: z.string().min(1)
});
