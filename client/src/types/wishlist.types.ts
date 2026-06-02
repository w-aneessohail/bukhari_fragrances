import type { ProductSummary } from "./product.types";

export type WishlistEntry = {
  wishlistId: string;
  addedAt: string;
  product: ProductSummary;
};
