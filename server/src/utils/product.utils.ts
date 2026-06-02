import type { Prisma } from "@prisma/client";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function decimalToNumber(value: Prisma.Decimal | number | null | undefined) {
  if (value === null || value === undefined) {
    return null;
  }

  return Number(value);
}

export function mapProductSummary(product: {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: Prisma.Decimal;
  salePrice: Prisma.Decimal | null;
  stock: number;
  sku: string;
  gender: string;
  concentration: string;
  scentFamily: string;
  isActive: boolean;
  isFeatured: boolean;
  tags: string[];
  createdAt: Date;
  images?: { url: string; altText: string | null; isMain: boolean }[];
  category?: { id: string; name: string; slug: string };
  reviews?: { rating: number }[];
  _count?: { reviews: number; orderItems: number };
}) {
  const ratings = product.reviews ?? [];
  const avgRating =
    ratings.length > 0 ? ratings.reduce((sum, review) => sum + review.rating, 0) / ratings.length : 0;

  const mainImage = product.images?.find((image) => image.isMain) ?? product.images?.[0];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: decimalToNumber(product.price),
    salePrice: decimalToNumber(product.salePrice),
    stock: product.stock,
    sku: product.sku,
    gender: product.gender,
    concentration: product.concentration,
    scentFamily: product.scentFamily,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    tags: product.tags,
    createdAt: product.createdAt,
    mainImage: mainImage?.url ?? null,
    category: product.category ?? null,
    avgRating: Number(avgRating.toFixed(1)),
    reviewCount: product._count?.reviews ?? ratings.length,
    orderCount: product._count?.orderItems ?? 0
  };
}
