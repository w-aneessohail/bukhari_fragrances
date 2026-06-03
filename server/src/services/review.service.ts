import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";

async function userHasPurchasedProduct(userId: string, productId: string) {
  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"] }
      }
    }
  });

  return Boolean(orderItem);
}

function mapReview(review: {
  id: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  helpfulCount: number;
  createdAt: Date;
  user: { id: string; name: string };
  product?: { id: string; name: string; slug: string };
}) {
  return {
    id: review.id,
    rating: review.rating,
    comment: review.comment,
    isVerified: review.isVerified,
    helpfulCount: review.helpfulCount,
    createdAt: review.createdAt.toISOString(),
    user: review.user,
    product: review.product
      ? {
          id: review.product.id,
          name: review.product.name,
          slug: review.product.slug
        }
      : undefined
  };
}

export async function createReview(
  userId: string,
  input: { productId: string; rating: number; comment?: string }
) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, isActive: true }
  });

  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const existing = await prisma.review.findUnique({
    where: {
      userId_productId: { userId, productId: input.productId }
    }
  });

  if (existing) {
    throw new HttpError("You have already reviewed this product", 400);
  }

  const isVerified = await userHasPurchasedProduct(userId, input.productId);

  const review = await prisma.review.create({
    data: {
      userId,
      productId: input.productId,
      rating: input.rating,
      comment: input.comment?.trim() || null,
      isVerified
    },
    include: {
      user: { select: { id: true, name: true } }
    }
  });

  return mapReview(review);
}

export async function listProductReviews(
  productId: string,
  options: { page: number; limit: number; sort: "newest" | "highest" | "lowest" | "helpful" }
) {
  const product = await prisma.product.findFirst({ where: { id: productId } });
  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const orderBy =
    options.sort === "highest"
      ? { rating: "desc" as const }
      : options.sort === "lowest"
        ? { rating: "asc" as const }
        : options.sort === "helpful"
          ? { helpfulCount: "desc" as const }
          : { createdAt: "desc" as const };

  const skip = (options.page - 1) * options.limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: { user: { select: { id: true, name: true } } },
      orderBy,
      skip,
      take: options.limit
    }),
    prisma.review.count({ where: { productId } })
  ]);

  return {
    data: reviews.map(mapReview),
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit)
    }
  };
}

export async function markReviewHelpful(reviewId: string) {
  const review = await prisma.review.update({
    where: { id: reviewId },
    data: { helpfulCount: { increment: 1 } },
    include: { user: { select: { id: true, name: true } } }
  });

  return mapReview(review);
}

export async function deleteReview(reviewId: string, userId: string, isAdmin: boolean) {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });

  if (!review) {
    throw new HttpError("Review not found", 404);
  }

  if (!isAdmin && review.userId !== userId) {
    throw new HttpError("You can only delete your own review", 403);
  }

  await prisma.review.delete({ where: { id: reviewId } });
}

export async function listFeaturedReviews(limit = 8) {
  const reviews = await prisma.review.findMany({
    where: {
      comment: { not: null },
      rating: { gte: 4 }
    },
    include: {
      user: { select: { id: true, name: true } },
      product: { select: { id: true, name: true, slug: true } }
    },
    orderBy: [{ isVerified: "desc" }, { helpfulCount: "desc" }, { createdAt: "desc" }],
    take: limit
  });

  return reviews.map(mapReview);
}

export async function getUserReviewForProduct(userId: string, productId: string) {
  const review = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
    include: { user: { select: { id: true, name: true } } }
  });

  return review ? mapReview(review) : null;
}
