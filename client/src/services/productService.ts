import { api } from "./api";
import type { Category, ProductDetail, ProductListResponse, ProductSummary } from "../types/product.types";

export type ProductFilters = {
  page?: number;
  limit?: number;
  category?: string;
  gender?: string;
  scentFamily?: string;
  concentration?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  onSale?: boolean;
  sort?: "price_asc" | "price_desc" | "newest" | "bestseller" | "rating";
};

export async function fetchProducts(filters: ProductFilters = {}) {
  const response = await api.get<ProductListResponse>("/products", {
    params: {
      page: filters.page,
      limit: filters.limit,
      category: filters.category,
      gender: filters.gender,
      scentFamily: filters.scentFamily,
      concentration: filters.concentration,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      inStock: filters.inStock,
      isFeatured: filters.isFeatured,
      onSale: filters.onSale,
      sort: filters.sort
    }
  });

  return response.data;
}

export async function fetchCategories() {
  const response = await api.get<{ data: Category[] }>("/categories");
  return response.data.data;
}

export async function fetchProductBySlug(slug: string) {
  const response = await api.get<{ data: ProductDetail }>(`/products/${slug}`);
  return response.data.data;
}
