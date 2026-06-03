import type { OrderStatus } from "@prisma/client";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { decimalToNumber } from "../utils/product.utils.js";
import { parsePaginationParams, buildPaginationMeta } from "../utils/pagination.utils.js";
import { sendShippingUpdate } from "./email.service.js";
import { awardLoyaltyForDeliveredOrder } from "./loyalty.service.js";
import { ORDER_STATUS_LABELS } from "./payment.service.js";

export async function getDashboardStats() {
  const [activeProducts, totalOrders, totalCustomers, revenueAggregate, pendingOrders] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { status: "PENDING" } })
  ]);

  return {
    activeProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    totalRevenue: decimalToNumber(revenueAggregate._sum.total) ?? 0
  };
}

export async function listAllOrders(query: { page?: string; limit?: string }) {
  const { page, limit, skip } = parsePaginationParams(query);

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      }
    }),
    prisma.order.count()
  ]);

  return {
    items: orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: decimalToNumber(order.total),
      createdAt: order.createdAt.toISOString(),
      customer: order.user,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    })),
    pagination: buildPaginationMeta({ page, limit, totalItems })
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new HttpError("Order not found", 404);
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true
    }
  });

  if (status !== order.status) {
    await sendShippingUpdate(orderId, ORDER_STATUS_LABELS[status]);
  }

  if (status === "DELIVERED") {
    await awardLoyaltyForDeliveredOrder(orderId);
  }

  return {
    id: updated.id,
    orderNumber: updated.orderNumber,
    status: updated.status,
    paymentStatus: updated.paymentStatus,
    total: decimalToNumber(updated.total),
    createdAt: updated.createdAt.toISOString(),
    customer: updated.user,
    itemCount: updated.items.reduce((sum, item) => sum + item.quantity, 0)
  };
}

export async function listUsers(query: { page?: string; limit?: string }) {
  const { page, limit, skip } = parsePaginationParams(query);

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        loyaltyPoints: true,
        createdAt: true
      }
    }),
    prisma.user.count()
  ]);

  return {
    items: users.map((user) => ({
      ...user,
      createdAt: user.createdAt.toISOString()
    })),
    pagination: buildPaginationMeta({ page, limit, totalItems })
  };
}
