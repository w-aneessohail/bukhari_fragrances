import { api } from "./api";
import type { WishlistEntry } from "../types/wishlist.types";

export async function fetchWishlist() {
  const response = await api.get<{ data: WishlistEntry[] }>("/wishlist");
  return response.data.data;
}

export async function checkWishlist(productId: string) {
  const response = await api.get<{ data: { inWishlist: boolean } }>(`/wishlist/check/${productId}`);
  return response.data.data.inWishlist;
}

export async function addToWishlist(productId: string) {
  const response = await api.post<{ data: WishlistEntry[] }>("/wishlist", { productId });
  return response.data.data;
}

export async function removeFromWishlist(productId: string) {
  const response = await api.delete<{ data: WishlistEntry[] }>(`/wishlist/${productId}`);
  return response.data.data;
}
