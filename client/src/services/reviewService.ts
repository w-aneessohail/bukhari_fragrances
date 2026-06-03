import { api } from "./api";
import type { ProductReview } from "../types/product.types";

export type FeaturedReview = ProductReview & {
  product?: { id: string; name: string; slug: string };
};

export async function fetchFeaturedReviews() {
  const response = await api.get<{ data: FeaturedReview[] }>("/reviews/featured");
  return response.data.data;
}

export async function fetchMyProductReview(productId: string) {
  const response = await api.get<{ data: ProductReview | null }>(`/reviews/product/${productId}/mine`);
  return response.data.data;
}

export async function submitReview(input: { productId: string; rating: number; comment?: string }) {
  const response = await api.post<{ data: ProductReview }>("/reviews", input);
  return response.data.data;
}

export async function markReviewHelpful(reviewId: string) {
  const response = await api.put<{ data: ProductReview }>(`/reviews/${reviewId}/helpful`);
  return response.data.data;
}

export async function deleteReview(reviewId: string) {
  await api.delete(`/reviews/${reviewId}`);
}
