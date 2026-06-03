import { api } from "./api";

export type AdminDiscount = {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
  value: number;
  minOrder: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

export type DiscountInput = {
  code: string;
  type: AdminDiscount["type"];
  value: number;
  minOrder?: number | null;
  maxUses?: number | null;
  expiresAt?: string | null;
  isActive?: boolean;
};

export async function fetchAdminDiscounts() {
  const response = await api.get<{ data: AdminDiscount[] }>("/admin/discounts");
  return response.data.data;
}

export async function createAdminDiscount(input: DiscountInput) {
  const response = await api.post<{ data: AdminDiscount }>("/admin/discounts", input);
  return response.data.data;
}

export async function updateAdminDiscount(id: string, input: Partial<DiscountInput>) {
  const response = await api.patch<{ data: AdminDiscount }>(`/admin/discounts/${id}`, input);
  return response.data.data;
}

export async function deleteAdminDiscount(id: string) {
  await api.delete(`/admin/discounts/${id}`);
}
