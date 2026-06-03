import { api } from "./api";
import type { PaginationMeta } from "../types/product.types";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  createdAt: string;
  itemCount: number;
  customer: { id: string; name: string; email: string };
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  loyaltyPoints: number;
  createdAt: string;
};

export type DashboardStats = {
  activeProducts: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  totalRevenue: number;
  kpis: {
    revenueMTD: number;
    revenueChange: number;
    ordersMTD: number;
    ordersChange: number;
    newCustomersMTD: number;
    customersChange: number;
    avgOrderValue: number;
  };
  revenueByDay: { date: string; revenue: number }[];
  topProducts: { name: string; revenue: number; quantity: number }[];
  lowStockProducts: { id: string; name: string; slug: string; stock: number; sku: string }[];
  statusDistribution: { status: string; count: number }[];
  recentOrders: AdminOrder[];
};

export async function fetchDashboardStats() {
  const response = await api.get<{ data: DashboardStats }>("/admin/stats");
  return response.data.data;
}

export async function fetchAdminOrders(page = 1, limit = 20, filters?: { status?: string; search?: string }) {
  const response = await api.get<{ data: AdminOrder[]; pagination?: PaginationMeta }>("/admin/orders", {
    params: { page, limit, status: filters?.status, search: filters?.search }
  });
  return response.data;
}

export async function updateAdminOrderStatus(orderId: string, status: string) {
  const response = await api.patch<{ data: AdminOrder }>(`/admin/orders/${orderId}/status`, { status });
  return response.data.data;
}

export async function fetchAdminUsers(page = 1, limit = 20) {
  const response = await api.get<{ data: AdminUser[]; pagination?: PaginationMeta }>("/admin/users", {
    params: { page, limit }
  });
  return response.data;
}

export async function exportAdminOrdersCsv(filters?: { status?: string; search?: string }) {
  const response = await api.get<string>("/admin/orders/export", {
    params: filters,
    responseType: "text"
  });
  return response.data;
}
