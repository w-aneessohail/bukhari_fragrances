import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { mapProductSummary } from "../utils/product.utils.js";

const productInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  category: { select: { id: true, name: true, slug: true } },
  reviews: { select: { rating: true } },
  _count: { select: { reviews: true, orderItems: true } }
};

type DiaryInput = {
  productId: string;
  rating?: number;
  mood?: string;
  occasion?: string;
  notes?: string;
  dateWorn: Date;
};

function mapEntry(entry: {
  id: string;
  rating: number | null;
  mood: string | null;
  occasion: string | null;
  notes: string | null;
  dateWorn: Date;
  createdAt: Date;
  product: Parameters<typeof mapProductSummary>[0];
}) {
  return {
    id: entry.id,
    rating: entry.rating,
    mood: entry.mood,
    occasion: entry.occasion,
    notes: entry.notes,
    dateWorn: entry.dateWorn.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    product: mapProductSummary(entry.product)
  };
}

export async function listScentDiaryEntries(userId: string) {
  const entries = await prisma.scentDiary.findMany({
    where: { userId },
    include: { product: { include: productInclude } },
    orderBy: { dateWorn: "desc" }
  });

  return entries.map(mapEntry);
}

export async function createScentDiaryEntry(userId: string, input: DiaryInput) {
  const product = await prisma.product.findFirst({
    where: { id: input.productId, isActive: true }
  });

  if (!product) {
    throw new HttpError("Product not found", 404);
  }

  const entry = await prisma.scentDiary.create({
    data: {
      userId,
      productId: input.productId,
      rating: input.rating,
      mood: input.mood,
      occasion: input.occasion,
      notes: input.notes,
      dateWorn: input.dateWorn
    },
    include: { product: { include: productInclude } }
  });

  return mapEntry(entry);
}

export async function updateScentDiaryEntry(userId: string, entryId: string, input: Partial<DiaryInput>) {
  const existing = await prisma.scentDiary.findFirst({
    where: { id: entryId, userId }
  });

  if (!existing) {
    throw new HttpError("Diary entry not found", 404);
  }

  const entry = await prisma.scentDiary.update({
    where: { id: entryId },
    data: {
      rating: input.rating,
      mood: input.mood,
      occasion: input.occasion,
      notes: input.notes,
      dateWorn: input.dateWorn
    },
    include: { product: { include: productInclude } }
  });

  return mapEntry(entry);
}

export async function deleteScentDiaryEntry(userId: string, entryId: string) {
  const existing = await prisma.scentDiary.findFirst({
    where: { id: entryId, userId }
  });

  if (!existing) {
    throw new HttpError("Diary entry not found", 404);
  }

  await prisma.scentDiary.delete({ where: { id: entryId } });
  return { deleted: true };
}
