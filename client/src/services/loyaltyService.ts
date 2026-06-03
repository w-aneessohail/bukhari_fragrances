import { api } from "./api";

export type LoyaltyTransaction = {
  id: string;
  type: "EARNED" | "REDEEMED";
  points: number;
  description: string | null;
  orderNumber: string | null;
  createdAt: string;
};

export type LoyaltySummary = {
  balance: number;
  redemptionBlock: number;
  redemptionValue: number;
  transactions: LoyaltyTransaction[];
};

export async function fetchLoyaltySummary() {
  const response = await api.get<{ data: LoyaltySummary }>("/users/loyalty");
  return response.data.data;
}
