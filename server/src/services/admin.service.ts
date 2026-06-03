import type { OrderStatus } from "@prisma/client";
import { prisma } from "../config/database.js";
import { HttpError } from "../utils/httpError.js";
import { decimalToNumber } from "../utils/product.utils.js";
import { parsePaginationParams, buildPaginationMeta } from "../utils/pagination.utils.js";
import { sendShippingUpdate } from "./email.service.js";
import { awardLoyaltyForDeliveredOrder } from "./loyalty.service.js";
import { ORDER_STATUS_LABELS } from "./payment.service.js";

function monthBounds(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  const prevStart = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  const prevEnd = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59, 999);
  return { start, end, prevStart, prevEnd };
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export async function getDashboardStats() {
  const now = new Date();
  const { start, end, prevStart, prevEnd } = monthBounds(now);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 29);

  const [
    activeProducts,
    totalOrders,
    totalCustomers,
    revenueAggregate,
    pendingOrders,
    revenueMTD,
    revenuePrevMTD,
    ordersMTD,
    ordersPrevMTD,
    customersMTD,
    customersPrevMTD,
    recentOrders,
    lowStockProducts,
    ordersLast30Days,
    topProductsRaw,
    statusGroups
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ where: { createdAt: { gte: start, lte: end } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { createdAt: { gte: prevStart, lte: prevEnd } }, _sum: { total: true } }),
    prisma.order.count({ where: { createdAt: { gte: start, lte: end } } }),
    prisma.order.count({ where: { createdAt: { gte: prevStart, lte: prevEnd } } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: start, lte: end } } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: prevStart, lte: prevEnd } } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      }
    }),
    prisma.product.findMany({
      where: { isActive: true, stock: { lt: 5 } },
      orderBy: { stock: "asc" },
      take: 8,
      select: { id: true, name: true, slug: true, stock: true, sku: true }
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true, total: true }
    }),
    prisma.orderItem.findMany({
      select: { name: true, price: true, quantity: true }
    }),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } })
  ]);

  const revenueCurrent = decimalToNumber(revenueMTD._sum.total) ?? 0;
  const revenuePrevious = decimalToNumber(revenuePrevMTD._sum.total) ?? 0;
  const avgOrderValue = ordersMTD > 0 ? Number((revenueCurrent / ordersMTD).toFixed(2)) : 0;

  const revenueByDayMap = new Map<string, number>();
  for (let i = 0; i < 30; i += 1) {
    const day = new Date(thirtyDaysAgo);
    day.setDate(thirtyDaysAgo.getDate() + i);
    revenueByDayMap.set(day.toISOString().slice(0, 10), 0);
  }

  for (const order of ordersLast30Days) {
    const key = order.createdAt.toISOString().slice(0, 10);
    revenueByDayMap.set(key, (revenueByDayMap.get(key) ?? 0) + Number(order.total));
  }

  const topProductMap = new Map<string, { name: string; revenue: number; quantity: number }>();
  for (const item of topProductsRaw) {
    const revenue = Number(item.price) * item.quantity;
    const existing = topProductMap.get(item.name);
    if (existing) {
      existing.revenue += revenue;
      existing.quantity += item.quantity;
    } else {
      topProductMap.set(item.name, { name: item.name, revenue, quantity: item.quantity });
    }
  }

  const topProducts = Array.from(topProductMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return {
    activeProducts,
    totalOrders,
    totalCustomers,
    pendingOrders,
    totalRevenue: decimalToNumber(revenueAggregate._sum.total) ?? 0,
    kpis: {
      revenueMTD: revenueCurrent,
      revenueChange: percentChange(revenueCurrent, revenuePrevious),
      ordersMTD,
      ordersChange: percentChange(ordersMTD, ordersPrevMTD),
      newCustomersMTD: customersMTD,
      customersChange: percentChange(customersMTD, customersPrevMTD),
      avgOrderValue
    },
    revenueByDay: Array.from(revenueByDayMap.entries()).map(([date, revenue]) => ({ date, revenue })),
    topProducts,
    lowStockProducts,
    statusDistribution: statusGroups.map((group) => ({
      status: group.status,
      count: group._count.status
    })),
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: decimalToNumber(order.total),
      createdAt: order.createdAt.toISOString(),
      customer: order.user,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }))
  };
}

export async function listAllOrders(query: {
  page?: string;
  limit?: string;
  status?: string;
  search?: string;
}) {
  const { page, limit, skip } = parsePaginationParams(query);

  const where: {
    status?: OrderStatus;
    OR?: Array<{ orderNumber?: { contains: string; mode: "insensitive" }; user?: { name?: { contains: string; mode: "insensitive" }; email?: { contains: string; mode: "insensitive" } } }>;
  } = {};

  if (query.status) {
    where.status = query.status as OrderStatus;
  }

  if (query.search?.trim()) {
    const term = query.search.trim();
    where.OR = [
      { orderNumber: { contains: term, mode: "insensitive" } },
      { user: { name: { contains: term, mode: "insensitive" } } },
      { user: { email: { contains: term, mode: "insensitive" } } }
    ];
  }

  const [orders, totalItems] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      }
    }),
    prisma.order.count({ where })
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

export async function exportOrdersCsv(query: { status?: string; search?: string }) {
  const result = await listAllOrders({ ...query, page: "1", limit: "1000" });
  const header = "Order Number,Customer,Email,Total,Status,Payment Method,Created At\n";
  const rows = result.items
    .map(
      (order) =>
        `"${order.orderNumber}","${order.customer.name}","${order.customer.email}",${order.total},"${order.status}","${order.paymentMethod}","${order.createdAt}"`
    )
    .join("\n");

  return `${header}${rows}\n`;
}
