import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import {
  calculateEarnedPoints,
  calculateLoyaltyDiscount,
  LOYALTY_REDEMPTION_BLOCK
} from "../utils/loyalty.utils.js";

export async function getUserLoyaltySummary(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyPoints: true }
  });

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const transactions = await prisma.loyaltyTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      order: { select: { orderNumber: true } }
    }
  });

  return {
    balance: user.loyaltyPoints,
    redemptionBlock: LOYALTY_REDEMPTION_BLOCK,
    redemptionValue: 50,
    transactions: transactions.map((entry) => ({
      id: entry.id,
      type: entry.type,
      points: entry.points,
      description: entry.description,
      orderNumber: entry.order?.orderNumber ?? null,
      createdAt: entry.createdAt.toISOString()
    }))
  };
}

export async function previewLoyaltyRedemption(userId: string, applicableTotal: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyPoints: true }
  });

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const { pointsUsed, discount } = calculateLoyaltyDiscount(user.loyaltyPoints, applicableTotal);

  return {
    balance: user.loyaltyPoints,
    pointsUsed,
    discount
  };
}

export async function redeemLoyaltyPoints(
  userId: string,
  applicableTotal: number,
  orderId: string
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { loyaltyPoints: true }
  });

  if (!user) {
    throw new HttpError("User not found", 404);
  }

  const { pointsUsed, discount } = calculateLoyaltyDiscount(user.loyaltyPoints, applicableTotal);
  if (pointsUsed <= 0) {
    return { pointsUsed: 0, discount: 0 };
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { loyaltyPoints: { decrement: pointsUsed } }
    });

    await tx.loyaltyTransaction.create({
      data: {
        userId,
        orderId,
        type: "REDEEMED",
        points: pointsUsed,
        description: `Redeemed for order discount (Rs. ${discount})`
      }
    });
  });

  return { pointsUsed, discount };
}

export async function awardLoyaltyForDeliveredOrder(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      loyaltyTransactions: {
        where: { type: "EARNED" }
      }
    }
  });

  if (!order || order.status !== "DELIVERED" || order.loyaltyTransactions.length > 0) {
    return;
  }

  const points = calculateEarnedPoints(Number(order.total));
  if (points <= 0) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: order.userId },
      data: { loyaltyPoints: { increment: points } }
    });

    await tx.loyaltyTransaction.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        type: "EARNED",
        points,
        description: `Earned from order ${order.orderNumber}`
      }
    });
  });
}

export async function restoreLoyaltyOnCancel(orderId: string) {
  const redeemed = await prisma.loyaltyTransaction.findFirst({
    where: { orderId, type: "REDEEMED" }
  });

  if (!redeemed) {
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: redeemed.userId },
      data: { loyaltyPoints: { increment: redeemed.points } }
    });

    await tx.loyaltyTransaction.create({
      data: {
        userId: redeemed.userId,
        orderId,
        type: "EARNED",
        points: redeemed.points,
        description: "Loyalty points restored after order cancellation"
      }
    });
  });
}
