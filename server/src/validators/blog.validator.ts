import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional(),
  content: z.string().min(10),
  excerpt: z.string().max(400).optional().nullable(),
  image: z.string().url().optional().nullable(),
  tags: z.array(z.string().min(1)).optional(),
  publish: z.boolean().optional()
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogSlugParamsSchema = z.object({
  slug: z.string().min(1)
});

export const blogIdParamsSchema = z.object({
  id: z.string().min(1)
});
