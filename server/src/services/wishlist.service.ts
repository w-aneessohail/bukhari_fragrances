import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { mapProductSummary } from "../utils/product.utils.js";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  category: { select: { id: true, name: true, slug: true } },
  reviews: { select: { rating: true } },
  _count: { select: { reviews: true, orderItems: true } }
};

export async function getWishlist(userId: string) {
  const items = await prisma.wishlist.findMany({
    where: { userId },
    include: { product: { include: productInclude } },
    orderBy: { addedAt: "desc" }
  });

  return items
    .filter((entry) => entry.product.isActive)
    .map((entry) => ({
      wishlistId: entry.id,
      addedAt: entry.addedAt.toISOString(),
      product: mapProductSummary(entry.product)
    }));
}

export async function addToWishlist(userId: string, productId: string) {
  const product = await prisma.product.findFirst({
    where: { id: productId, isActive: true }
  });

  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  await prisma.wishlist.upsert({
    where: {
      userId_productId: { userId, productId }
    },
    create: { userId, productId },
    update: {}
  });

  return getWishlist(userId);
}

export async function removeFromWishlist(userId: string, productId: string) {
  await prisma.wishlist.deleteMany({
    where: { userId, productId }
  });

  return getWishlist(userId);
}

export async function isProductInWishlist(userId: string, productId: string) {
  const entry = await prisma.wishlist.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  return Boolean(entry);
}
