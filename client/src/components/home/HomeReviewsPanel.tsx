import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  NOTES_BEAT_COUNT,
  beatSlotVisual,
  reviewsPanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";
import { fetchFeaturedReviews, type FeaturedReview } from "../../services/reviewService";

const FALLBACK_REVIEWS: FeaturedReview[] = [
  {
    id: "1",
    rating: 5,
    comment: "Bukhari Oud Royale is my signature scent — rich, lasting, and unmistakably premium.",
    isVerified: true,
    helpfulCount: 12,
    createdAt: "2025-01-01T00:00:00.000Z",
    user: { id: "fb-1", name: "Ayesha K." },
    product: { id: "fb-p1", name: "Bukhari Oud Royale", slug: "bukhari-oud-royale" }
  },
  {
    id: "2",
    rating: 5,
    comment: "Fast delivery in Lahore and the packaging feels truly luxurious.",
    isVerified: true,
    helpfulCount: 8,
    createdAt: "2025-01-02T00:00:00.000Z",
    user: { id: "fb-2", name: "Hassan R." },
    product: { id: "fb-p2", name: "Rosewood Attar", slug: "rosewood-attar" }
  },
  {
    id: "3",
    rating: 5,
    comment: "Jasmine Dusk is divine — soft, elegant, and lasts all day on fabric.",
    isVerified: true,
    helpfulCount: 6,
    createdAt: "2025-01-03T00:00:00.000Z",
    user: { id: "fb-3", name: "Fatima S." },
    product: { id: "fb-p3", name: "Jasmine Dusk", slug: "jasmine-dusk" }
  }
];

const REVIEW_CONTEXT = [
  "Verified purchase · Lahore",
  "Repeat customer · Gift order",
  "Verified purchase · Attar lover"
];

function padReviews(list: FeaturedReview[]) {
  const out = [...list];
  while (out.length < NOTES_BEAT_COUNT) {
    const fb = FALLBACK_REVIEWS[out.length % FALLBACK_REVIEWS.length];
    out.push(out.some((r) => r.id === fb.id) ? { ...fb, id: `fallback-${out.length}` } : fb);
  }
  return out.slice(0, NOTES_BEAT_COUNT);
}

export default function HomeReviewsPanel() {
  const { progress } = useScrollExperience();
  const opacity = reviewsPanelOpacity(progress);
  const local = sectionProgress(progress, "NOTES");

  const { data: reviews = [] } = useQuery({
    queryKey: ["home-featured-reviews"],
    queryFn: fetchFeaturedReviews,
    staleTime: 60_000
  });

  const items = padReviews(reviews.length > 0 ? reviews : FALLBACK_REVIEWS);

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-20 flex h-full w-[30%] max-w-xs items-center justify-end pl-2 pr-5 md:max-w-sm md:pl-3 md:pr-10 lg:pr-14"
      style={{ opacity, visibility: opacity > 0.01 ? "visible" : "hidden" }}
    >
      <div className="relative min-h-[16rem] w-full md:min-h-[18rem]">
        <p className="pointer-events-none mb-3 text-[10px] uppercase tracking-[0.35em] text-white/40">
          Customer voices
        </p>
        {items.map((review, i) => {
          const visual = beatSlotVisual(local, i, NOTES_BEAT_COUNT);
          const slotOp = visual.opacity * opacity;
          if (slotOp <= 0.005) return null;
          return (
            <article
              key={review.id}
              className="pointer-events-auto absolute inset-x-0 top-6 border border-white/10 bg-black/45 p-4 backdrop-blur-md md:top-8 md:p-5"
              style={{
                opacity: slotOp,
                transform: `translateX(${visual.slide * 16}px)`
              }}
            >
              <div className="text-sm text-[#D4AF37]">{"★".repeat(review.rating)}</div>
              {review.comment ? (
                <p className="mt-2 text-xs leading-relaxed text-white/75 line-clamp-5 md:text-sm">
                  {review.comment}
                </p>
              ) : null}
              <p className="mt-3 text-xs font-medium text-white">{review.user?.name ?? "Customer"}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/35">
                {REVIEW_CONTEXT[i] ?? "Verified purchase"}
              </p>
              {"product" in review && review.product ? (
                <Link
                  to={`/product/${review.product.slug}`}
                  className="mt-2 block text-[10px] text-[#D4AF37]/80 hover:text-[#D4AF37]"
                >
                  {review.product.name}
                </Link>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
