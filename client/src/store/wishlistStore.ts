import { create } from "zustand";
import * as wishlistService from "../services/wishlistService";
import type { WishlistEntry } from "../types/wishlist.types";

type WishlistState = {
  items: WishlistEntry[];
  productIds: Set<string>;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  toggleItem: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
  setFromList: (items: WishlistEntry[]) => void;
};

function toIdSet(items: WishlistEntry[]) {
  return new Set(items.map((entry) => entry.product.id));
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  productIds: new Set(),
  isLoading: false,

  isInWishlist: (productId) => get().productIds.has(productId),

  setFromList: (items) => set({ items, productIds: toIdSet(items) }),

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const items = await wishlistService.fetchWishlist();
      set({ items, productIds: toIdSet(items), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleItem: async (productId) => {
    const inWishlist = get().productIds.has(productId);

    if (inWishlist) {
      const items = await wishlistService.removeFromWishlist(productId);
      set({ items, productIds: toIdSet(items) });
      return false;
    }

    const items = await wishlistService.addToWishlist(productId);
    set({ items, productIds: toIdSet(items) });
    return true;
  }
}));
