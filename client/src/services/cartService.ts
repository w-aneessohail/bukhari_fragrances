import { api } from "./api";
import type { Cart } from "../types/cart.types";

export async function fetchCart() {
  const response = await api.get<{ data: Cart }>("/cart");
  return response.data.data;
}

export async function addToCart(input: {
  productId: string;
  sizeId?: string | null;
  quantity?: number;
}) {
  const response = await api.post<{ data: Cart }>("/cart/items", input);
  return response.data.data;
}

export async function updateCartItem(itemId: string, quantity: number) {
  const response = await api.patch<{ data: Cart }>(`/cart/items/${itemId}`, { quantity });
  return response.data.data;
}

export async function removeCartItem(itemId: string) {
  const response = await api.delete<{ data: Cart }>(`/cart/items/${itemId}`);
  return response.data.data;
}

export async function clearCart() {
  const response = await api.delete<{ data: Cart }>("/cart");
  return response.data.data;
}
