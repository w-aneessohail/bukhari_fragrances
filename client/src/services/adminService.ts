import { api } from "./api";
import type { PaginationMeta } from "../types/product.types";

export type DashboardStats = {
  activeProducts: number;
  totalOrders: number;
  totalCustomers: number;
  pendingOrders: number;
  totalRevenue: number;
};

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

export async function fetchDashboardStats() {
  const response = await api.get<{ data: DashboardStats }>("/admin/stats");
  return response.data.data;
}

export async function fetchAdminOrders(page = 1, limit = 20) {
  const response = await api.get<{ data: AdminOrder[]; pagination?: PaginationMeta }>("/admin/orders", {
    params: { page, limit }
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
