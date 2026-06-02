import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { buildPaginationMeta, parsePaginationParams } from "../utils/pagination.utils.js";
import { decimalToNumber, mapProductSummary, slugify } from "../utils/product.utils.js";
import type { productListQuerySchema } from "../validators/product.validator.js";
import type { z } from "zod";

type ProductListQuery = z.infer<typeof productListQuerySchema>;

type CreateProductInput = {
  name: string;
  slug?: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  sku: string;
  categoryId: string;
  gender: "MEN" | "WOMEN" | "UNISEX";
  concentration: "EAU_DE_COLOGNE" | "EAU_DE_TOILETTE" | "EAU_DE_PARFUM" | "PARFUM" | "ATTAR";
  scentFamily:
    | "FLORAL"
    | "ORIENTAL"
    | "WOODY"
    | "FRESH"
    | "CITRUS"
    | "GOURMAND"
    | "CHYPRE"
    | "FOUGERE"
    | "AQUATIC";
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  scentNotes?: { noteType: "TOP" | "HEART" | "BASE"; ingredientName: string; intensity: number }[];
  sizes?: { sizeMl: number; price: number; stock: number }[];
};

type UpdateProductInput = Partial<CreateProductInput>;

function parseBoolean(value?: string) {
  if (value === undefined) return undefined;
  return value === "true";
}

async function ensureUniqueProductSlug(baseSlug: string, excludeId?: string) {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {})
      }
    });

    if (!existing) {
      return slug;
    }

    counter += 1;
    slug = `${baseSlug}-${counter}`;
  }
}

function buildWhere(filters: ProductListQuery): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {
    isActive: true
  };

  if (filters.category) {
    where.category = {
      OR: [{ slug: filters.category }, { id: filters.category }]
    };
  }

  if (filters.gender) {
    where.gender = filters.gender;
  }

  if (filters.scentFamily) {
    where.scentFamily = filters.scentFamily;
  }

  if (filters.concentration) {
    where.concentration = filters.concentration;
  }

  if (filters.minPrice || filters.maxPrice) {
    where.price = {
      ...(filters.minPrice ? { gte: new Prisma.Decimal(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { lte: new Prisma.Decimal(filters.maxPrice) } : {})
    };
  }

  if (parseBoolean(filters.inStock)) {
    where.stock = { gt: 0 };
  }

  if (parseBoolean(filters.isFeatured)) {
    where.isFeatured = true;
  }

  if (parseBoolean(filters.onSale)) {
    where.salePrice = { not: null };
  }

  return where;
}

function buildOrderBy(sort?: ProductListQuery["sort"]): Prisma.ProductOrderByWithRelationInput {
  switch (sort) {
    case "price_asc":
      return { price: "asc" };
    case "price_desc":
      return { price: "desc" };
    case "bestseller":
      return { orderItems: { _count: "desc" } };
    case "rating":
      return { reviews: { _count: "desc" } };
    case "newest":
    default:
      return { createdAt: "desc" };
  }
}

const productListInclude = {
  images: { orderBy: { sortOrder: "asc" } },
  category: { select: { id: true, name: true, slug: true } },
  reviews: { select: { rating: true } },
  _count: { select: { reviews: true, orderItems: true } }
} satisfies Prisma.ProductInclude;

export async function getProducts(query: ProductListQuery) {
  const { page, limit, skip } = parsePaginationParams(query);
  const where = buildWhere(query);

  const [items, totalItems] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productListInclude,
      orderBy: buildOrderBy(query.sort),
      skip,
      take: limit
    }),
    prisma.product.count({ where })
  ]);

  return {
    items: items.map(mapProductSummary),
    pagination: buildPaginationMeta({ page, limit, totalItems })
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      scentNotes: true,
      sizes: { orderBy: { sizeMl: "asc" } },
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });

  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id }
    },
    include: productListInclude,
    take: 4
  });

  const ratings = product.reviews;
  const avgRating =
    ratings.length > 0 ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length : 0;

  return {
    ...mapProductSummary(product),
    images: product.images,
    scentNotes: product.scentNotes,
    sizes: product.sizes.map((size) => ({
      ...size,
      price: decimalToNumber(size.price)
    })),
    reviews: product.reviews,
    avgRating: Number(avgRating.toFixed(1)),
    reviewCount: ratings.length,
    relatedProducts: relatedProducts.map(mapProductSummary)
  };
}

export async function createProduct(input: CreateProductInput) {
  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category) {
    throw new HttpError("Category not found", 404);
  }

  const slug = await ensureUniqueProductSlug(slugify(input.slug ?? input.name));

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        name: input.name,
        slug,
        description: input.description,
        price: new Prisma.Decimal(input.price),
        salePrice: input.salePrice ? new Prisma.Decimal(input.salePrice) : null,
        stock: input.stock,
        sku: input.sku,
        categoryId: input.categoryId,
        gender: input.gender,
        concentration: input.concentration,
        scentFamily: input.scentFamily,
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
        tags: input.tags ?? []
      }
    });

    if (input.scentNotes?.length) {
      await tx.scentNote.createMany({
        data: input.scentNotes.map((note) => ({ ...note, productId: product.id }))
      });
    }

    if (input.sizes?.length) {
      await tx.productSize.createMany({
        data: input.sizes.map((size) => ({
          productId: product.id,
          sizeMl: size.sizeMl,
          price: new Prisma.Decimal(size.price),
          stock: size.stock
        }))
      });
    }

    return product;
  });
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError("Product not found", 404);
  }

  if (input.categoryId) {
    const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
    if (!category) {
      throw new HttpError("Category not found", 404);
    }
  }

  const slug =
    input.slug || input.name
      ? await ensureUniqueProductSlug(slugify(input.slug ?? input.name ?? existing.name), id)
      : existing.slug;

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name: input.name,
        slug,
        description: input.description,
        price: input.price !== undefined ? new Prisma.Decimal(input.price) : undefined,
        salePrice:
          input.salePrice !== undefined
            ? input.salePrice === null
              ? null
              : new Prisma.Decimal(input.salePrice)
            : undefined,
        stock: input.stock,
        sku: input.sku,
        categoryId: input.categoryId,
        gender: input.gender,
        concentration: input.concentration,
        scentFamily: input.scentFamily,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
        tags: input.tags
      }
    });

    if (input.scentNotes) {
      await tx.scentNote.deleteMany({ where: { productId: id } });
      if (input.scentNotes.length) {
        await tx.scentNote.createMany({
          data: input.scentNotes.map((note) => ({ ...note, productId: id }))
        });
      }
    }

    if (input.sizes) {
      await tx.productSize.deleteMany({ where: { productId: id } });
      if (input.sizes.length) {
        await tx.productSize.createMany({
          data: input.sizes.map((size) => ({
            productId: id,
            sizeMl: size.sizeMl,
            price: new Prisma.Decimal(size.price),
            stock: size.stock
          }))
        });
      }
    }

    return product;
  });
}

export async function deleteProduct(id: string) {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new HttpError("Product not found", 404);
  }

  return prisma.product.update({
    where: { id },
    data: { isActive: false }
  });
}

export async function uploadProductImages(
  productId: string,
  files: { url: string; publicId: string; originalName: string }[]
) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const existingCount = await prisma.productImage.count({ where: { productId } });

  await prisma.productImage.createMany({
    data: files.map((file, index) => ({
      productId,
      url: file.url,
      publicId: file.publicId,
      altText: file.originalName,
      isMain: existingCount === 0 && index === 0,
      sortOrder: existingCount + index
    }))
  });

  return prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" }
  });
}

async function getCuratedProducts(where: Prisma.ProductWhereInput, take: number) {
  const products = await prisma.product.findMany({
    where: { ...where, isActive: true },
    include: productListInclude,
    take
  });

  return products.map(mapProductSummary);
}

export async function getFeaturedProducts() {
  return getCuratedProducts({ isFeatured: true }, 8);
}

export async function getBestsellerProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: productListInclude,
    orderBy: { orderItems: { _count: "desc" } },
    take: 8
  });

  return products.map(mapProductSummary);
}

export async function getNewArrivalProducts() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: productListInclude,
    orderBy: { createdAt: "desc" },
    take: 8
  });

  return products.map(mapProductSummary);
}

export async function searchProducts(query: string, pageInput?: string, limitInput?: string) {
  const { page, limit, skip } = parsePaginationParams({ page: pageInput, limit: limitInput });

  const rows = await prisma.$queryRaw<{ id: string }[]>`
    SELECT p.id
    FROM "Product" p
    WHERE p."isActive" = true
      AND (
        to_tsvector('english', coalesce(p.name, '') || ' ' || coalesce(p.description, '') || ' ' || array_to_string(p.tags, ' '))
        @@ plainto_tsquery('english', ${query})
      )
    ORDER BY p."createdAt" DESC
    OFFSET ${skip}
    LIMIT ${limit}
  `;

  const countRows = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count
    FROM "Product" p
    WHERE p."isActive" = true
      AND (
        to_tsvector('english', coalesce(p.name, '') || ' ' || coalesce(p.description, '') || ' ' || array_to_string(p.tags, ' '))
        @@ plainto_tsquery('english', ${query})
      )
  `;

  const ids = rows.map((row) => row.id);
  if (!ids.length) {
    return {
      items: [],
      pagination: buildPaginationMeta({ page, limit, totalItems: 0 })
    };
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: productListInclude
  });

  const productMap = new Map(products.map((product) => [product.id, product]));
  const ordered = ids.map((id) => productMap.get(id)).filter(Boolean);

  return {
    items: ordered.map((product) => mapProductSummary(product!)),
    pagination: buildPaginationMeta({ page, limit, totalItems: Number(countRows[0]?.count ?? 0) })
  };
}
