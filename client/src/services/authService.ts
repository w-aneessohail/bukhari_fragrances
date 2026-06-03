import { api } from "./api";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export async function bootstrapSession() {
  try {
    const response = await api.post<{
      data: {
        user: {
          id: string;
          name: string;
          email: string;
          role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
          avatar: string | null;
          isVerified: boolean;
        };
        accessToken: string;
      };
    }>("/auth/refresh");

    const { user, accessToken } = response.data.data;
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setAccessToken(accessToken);
    return true;
  } catch {
    useAuthStore.getState().logout();
    return false;
  }
}

export async function logoutUser() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Clear local session even if the server call fails.
  }

  useAuthStore.getState().logout();
  useWishlistStore.getState().setFromList([]);

  try {
    await useCartStore.getState().fetchCart();
  } catch {
    useCartStore.getState().setCart({
      id: null,
      items: [],
      subtotal: 0,
      itemCount: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      discountCode: null
    });
  }
}
