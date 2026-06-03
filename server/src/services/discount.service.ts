import { DiscountType, Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { decimalToNumber } from "../utils/product.utils.js";

export const createDiscountSchema = z.object({
  code: z.string().trim().min(2).max(50),
  type: z.nativeEnum(DiscountType),
  value: z.coerce.number().positive(),
  minOrder: z.coerce.number().nonnegative().optional().nullable(),
  maxUses: z.coerce.number().int().positive().optional().nullable(),
  expiresAt: z.string().datetime().optional().nullable(),
  isActive: z.boolean().default(true)
});

export const updateDiscountSchema = createDiscountSchema.partial();

export const discountIdParamsSchema = z.object({
  id: z.string().min(1)
});

function mapDiscount(discount: {
  id: string;
  code: string;
  type: DiscountType;
  value: Prisma.Decimal;
  minOrder: Prisma.Decimal | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | null;
  isActive: boolean;
  createdAt: Date;
}) {
  return {
    id: discount.id,
    code: discount.code,
    type: discount.type,
    value: decimalToNumber(discount.value),
    minOrder: discount.minOrder ? decimalToNumber(discount.minOrder) : null,
    maxUses: discount.maxUses,
    usedCount: discount.usedCount,
    expiresAt: discount.expiresAt?.toISOString() ?? null,
    isActive: discount.isActive,
    createdAt: discount.createdAt.toISOString()
  };
}

export async function listDiscounts() {
  const discounts = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" }
  });

  return discounts.map(mapDiscount);
}

export async function createDiscount(input: z.infer<typeof createDiscountSchema>) {
  const code = input.code.trim().toUpperCase();

  const existing = await prisma.discount.findUnique({ where: { code } });
  if (existing) {
    throw new HttpError("Discount code already exists", 400);
  }

  const discount = await prisma.discount.create({
    data: {
      code,
      type: input.type,
      value: new Prisma.Decimal(input.value),
      minOrder: input.minOrder != null ? new Prisma.Decimal(input.minOrder) : null,
      maxUses: input.maxUses ?? null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      isActive: input.isActive
    }
  });

  return mapDiscount(discount);
}

export async function updateDiscount(id: string, input: z.infer<typeof updateDiscountSchema>) {
  const discount = await prisma.discount.findUnique({ where: { id } });
  if (!discount) {
    throw new HttpError("Discount not found", 404);
  }

  if (input.code) {
    const code = input.code.trim().toUpperCase();
    const duplicate = await prisma.discount.findFirst({
      where: { code, NOT: { id } }
    });
    if (duplicate) {
      throw new HttpError("Discount code already exists", 400);
    }
  }

  const updated = await prisma.discount.update({
    where: { id },
    data: {
      code: input.code ? input.code.trim().toUpperCase() : undefined,
      type: input.type,
      value: input.value != null ? new Prisma.Decimal(input.value) : undefined,
      minOrder:
        input.minOrder !== undefined
          ? input.minOrder != null
            ? new Prisma.Decimal(input.minOrder)
            : null
          : undefined,
      maxUses: input.maxUses !== undefined ? input.maxUses : undefined,
      expiresAt:
        input.expiresAt !== undefined
          ? input.expiresAt
            ? new Date(input.expiresAt)
            : null
          : undefined,
      isActive: input.isActive
    }
  });

  return mapDiscount(updated);
}

export async function deleteDiscount(id: string) {
  const discount = await prisma.discount.findUnique({ where: { id } });
  if (!discount) {
    throw new HttpError("Discount not found", 404);
  }

  await prisma.discount.delete({ where: { id } });
}
