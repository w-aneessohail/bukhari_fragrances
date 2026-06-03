import { api } from "./api";
import type { ProductSummary } from "../types/product.types";

export type ScentDiaryEntry = {
  id: string;
  rating: number | null;
  mood: string | null;
  occasion: string | null;
  notes: string | null;
  dateWorn: string;
  createdAt: string;
  product: ProductSummary;
};

export type ScentDiaryInput = {
  productId: string;
  rating?: number;
  mood?: string;
  occasion?: string;
  notes?: string;
  dateWorn: string;
};

export async function fetchScentDiary() {
  const response = await api.get<{ data: ScentDiaryEntry[] }>("/scent-diary");
  return response.data.data;
}

export async function createScentDiaryEntry(input: ScentDiaryInput) {
  const response = await api.post<{ data: ScentDiaryEntry }>("/scent-diary", input);
  return response.data.data;
}

export async function updateScentDiaryEntry(id: string, input: Partial<ScentDiaryInput>) {
  const response = await api.patch<{ data: ScentDiaryEntry }>(`/scent-diary/${id}`, input);
  return response.data.data;
}

export async function deleteScentDiaryEntry(id: string) {
  await api.delete(`/scent-diary/${id}`);
}
