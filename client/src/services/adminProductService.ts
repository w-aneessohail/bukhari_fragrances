import { api } from "./api";
import type { PaginationMeta, ProductSummary } from "../types/product.types";

export type AdminProductInput = {
  name: string;
  description: string;
  price: number;
  salePrice?: number | null;
  stock: number;
  sku: string;
  categoryId: string;
  gender: "MEN" | "WOMEN" | "UNISEX";
  concentration: "EAU_DE_COLOGNE" | "EAU_DE_TOILETTE" | "EAU_DE_PARFUM" | "PARFUM" | "ATTAR";
  scentFamily:
    | "FLORAL"
    | "ORIENTAL"
    | "WOODY"
    | "FRESH"
    | "CITRUS"
    | "GOURMAND"
    | "CHYPRE"
    | "FOUGERE"
    | "AQUATIC";
  isActive?: boolean;
  isFeatured?: boolean;
};

export type AdminProductUpdate = Partial<AdminProductInput>;

export async function fetchAdminProducts(page = 1, limit = 100) {
  const response = await api.get<{ data: ProductSummary[]; pagination?: PaginationMeta }>("/admin/products", {
    params: { page, limit }
  });
  return response.data;
}

export async function createAdminProduct(input: AdminProductInput) {
  const response = await api.post<{ data: ProductSummary }>("/admin/products", input);
  return response.data.data;
}

export async function updateAdminProduct(id: string, input: AdminProductUpdate) {
  const response = await api.put<{ data: ProductSummary }>(`/admin/products/${id}`, input);
  return response.data.data;
}

export async function deactivateAdminProduct(id: string) {
  await api.delete(`/admin/products/${id}`);
}

export async function uploadAdminProductImages(productId: string, files: FileList | File[]) {
  const formData = new FormData();
  const list = Array.from(files);
  list.forEach((file) => formData.append("images", file));

  const response = await api.post<{ data: { url: string }[] }>(
    `/admin/products/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return response.data.data;
}
