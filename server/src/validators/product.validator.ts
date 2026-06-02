import { z } from "zod";

const concentrationEnum = z.enum([
  "EAU_DE_COLOGNE",
  "EAU_DE_TOILETTE",
  "EAU_DE_PARFUM",
  "PARFUM",
  "ATTAR"
]);

const genderEnum = z.enum(["MEN", "WOMEN", "UNISEX"]);

const scentFamilyEnum = z.enum([
  "FLORAL",
  "ORIENTAL",
  "WOODY",
  "FRESH",
  "CITRUS",
  "GOURMAND",
  "CHYPRE",
  "FOUGERE",
  "AQUATIC"
]);

const noteTypeEnum = z.enum(["TOP", "HEART", "BASE"]);

const scentNoteSchema = z.object({
  noteType: noteTypeEnum,
  ingredientName: z.string().min(1).max(120),
  intensity: z.number().int().min(1).max(10)
});

const sizeSchema = z.object({
  sizeMl: z.number().int().positive(),
  price: z.number().positive(),
  stock: z.number().int().min(0)
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(180).optional(),
  description: z.string().min(10),
  price: z.number().positive(),
  salePrice: z.number().positive().optional().nullable(),
  stock: z.number().int().min(0),
  sku: z.string().min(2).max(80),
  categoryId: z.string().min(1),
  gender: genderEnum,
  concentration: concentrationEnum,
  scentFamily: scentFamilyEnum,
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  tags: z.array(z.string().min(1)).optional(),
  scentNotes: z.array(scentNoteSchema).optional(),
  sizes: z.array(sizeSchema).optional()
});

export const updateProductSchema = createProductSchema.partial();

export const productListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  category: z.string().optional(),
  gender: genderEnum.optional(),
  scentFamily: scentFamilyEnum.optional(),
  concentration: concentrationEnum.optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  inStock: z.string().optional(),
  isFeatured: z.string().optional(),
  onSale: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "bestseller", "rating"]).optional()
});

export const productIdParamsSchema = z.object({
  id: z.string().min(1)
});

export const productSlugParamsSchema = z.object({
  slug: z.string().min(1)
});

export const searchQuerySchema = z.object({
  q: z.string().min(1),
  page: z.string().optional(),
  limit: z.string().optional()
});
