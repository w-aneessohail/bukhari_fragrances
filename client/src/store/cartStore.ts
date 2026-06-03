import { create } from "zustand";
import * as cartService from "../services/cartService";
import type { Cart } from "../types/cart.types";

const emptyCart: Cart = {
  id: null,
  items: [],
  subtotal: 0,
  itemCount: 0,
  discount: 0,
  shipping: 0,
  total: 0,
  discountCode: null
};

type CartState = {
  cart: Cart;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (input: { productId: string; sizeId?: string | null; quantity?: number }) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  applyDiscount: (code: string) => Promise<void>;
  removeDiscount: () => Promise<void>;
  setCart: (cart: Cart) => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: emptyCart,
  isLoading: false,
  error: null,

  setCart: (cart) => set({ cart, error: null }),

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const cart = await cartService.fetchCart();
      set({ cart, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Could not load cart" });
    }
  },

  addItem: async (input) => {
    set({ error: null });
    try {
      const cart = await cartService.addToCart(input);
      set({ cart });
    } catch (error) {
      const axiosMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const message = axiosMessage ?? "Could not add to cart";
      set({ error: message });
      throw new Error(message);
    }
  },

  updateItem: async (itemId, quantity) => {
    set({ error: null });
    try {
      const cart = await cartService.updateCartItem(itemId, quantity);
      set({ cart });
    } catch {
      set({ error: "Could not update item" });
      throw new Error("Could not update item");
    }
  },

  removeItem: async (itemId) => {
    set({ error: null });
    try {
      const cart = await cartService.removeCartItem(itemId);
      set({ cart });
    } catch {
      set({ error: "Could not remove item" });
    }
  },

  clear: async () => {
    set({ error: null });
    try {
      const cart = await cartService.clearCart();
      set({ cart });
    } catch {
      set({ error: "Could not clear cart" });
    }
  },

  applyDiscount: async (code) => {
    set({ error: null });
    try {
      const cart = await cartService.applyDiscount(code);
      set({ cart });
    } catch (error) {
      const axiosMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const message = axiosMessage ?? "Could not apply discount";
      set({ error: message });
      throw new Error(message);
    }
  },

  removeDiscount: async () => {
    set({ error: null });
    try {
      const cart = await cartService.removeDiscount();
      set({ cart });
    } catch {
      set({ error: "Could not remove discount" });
    }
  }
}));
