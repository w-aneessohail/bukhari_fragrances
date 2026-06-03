import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { markReviewHelpful, submitReview } from "../../services/reviewService";
import type { ProductReview } from "../../types/product.types";

type ReviewFormProps = {
  productId: string;
  existingReview?: ProductReview | null;
  onSubmitted?: () => void;
};

export default function ReviewForm({ productId, existingReview, onSubmitted }: ReviewFormProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [comment, setComment] = useState(existingReview?.comment ?? "");
  const [error, setError] = useState<string | null>(null);

  const submitMutation = useMutation({
    mutationFn: () => submitReview({ productId, rating, comment: comment.trim() || undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product"] });
      onSubmitted?.();
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Could not submit review";
      setError(message);
    }
  });

  if (!isAuthenticated) {
    return (
      <p className="mt-4 text-sm text-text-secondary">
        Sign in to share your experience with this fragrance.
      </p>
    );
  }

  if (existingReview) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-bg-secondary p-4 text-sm">
        <p className="text-text-secondary">You reviewed this product ({existingReview.rating} ★).</p>
      </div>
    );
  }

  return (
    <form
      className="mt-4 space-y-4 rounded-lg border border-border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        if (rating < 1) {
          setError("Please select a star rating.");
          return;
        }
        submitMutation.mutate();
      }}
    >
      <div>
        <p className="text-sm text-text-secondary">Your rating</p>
        <div className="mt-2 flex gap-1">
          {Array.from({ length: 5 }).map((_, index) => {
            const value = index + 1;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className={`text-2xl ${value <= rating ? "text-accent-gold" : "text-text-secondary/40"}`}
                aria-label={`Rate ${value} stars`}
              >
                ★
              </button>
            );
          })}
        </div>
      </div>

      <label className="block text-sm">
        <span className="text-text-secondary">Comment (optional)</span>
        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          rows={3}
          className="mt-1 w-full rounded-md border border-border bg-input px-3 py-2"
          placeholder="What did you love about this scent?"
        />
      </label>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <button
        type="submit"
        disabled={submitMutation.isPending}
        className="rounded-lg bg-accent-gold px-4 py-2 text-sm font-medium text-bg-primary disabled:opacity-50"
      >
        {submitMutation.isPending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}

type ReviewListProps = {
  reviews: ProductReview[];
  onHelpful?: () => void;
};

export function ReviewList({ reviews, onHelpful }: ReviewListProps) {
  const helpfulMutation = useMutation({
    mutationFn: markReviewHelpful,
    onSuccess: () => onHelpful?.()
  });

  if (reviews.length === 0) {
    return <p className="mt-4 text-sm text-text-secondary">No reviews yet. Be the first to share your experience.</p>;
  }

  return (
    <ul className="mt-4 space-y-4">
      {reviews.map((review) => (
        <li key={review.id} className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-text-primary">{review.user.name}</span>
            <span className="text-sm text-accent-gold">{review.rating} ★</span>
          </div>
          {review.comment ? <p className="mt-2 text-sm text-text-secondary">{review.comment}</p> : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
            {review.isVerified ? <span>Verified purchase</span> : null}
            <button
              type="button"
              onClick={() => helpfulMutation.mutate(review.id)}
              className="underline hover:text-accent-gold"
            >
              Helpful ({review.helpfulCount})
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
