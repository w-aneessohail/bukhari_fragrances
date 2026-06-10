import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchFeaturedReviews } from "../../services/reviewService";

const FALLBACK_REVIEWS = [
  {
    id: "1",
    rating: 5,
    comment: "Bukhari Oud Royale is my signature scent — rich, lasting, and unmistakably premium.",
    user: { name: "Ayesha K." },
    product: { name: "Bukhari Oud Royale", slug: "bukhari-oud-royale" }
  },
  {
    id: "2",
    rating: 5,
    comment: "Fast delivery in Lahore and the packaging feels truly luxurious.",
    user: { name: "Hassan R." },
    product: { name: "Rosewood Attar", slug: "rosewood-attar" }
  }
];

export default function HomeReviewsPanel({ visible }: { visible: boolean }) {
  const { data: reviews = [] } = useQuery({
    queryKey: ["home-featured-reviews"],
    queryFn: fetchFeaturedReviews,
    staleTime: 60_000
  });

  const display = reviews.length > 0 ? reviews.slice(0, 2) : FALLBACK_REVIEWS;

  return (
    <div
      className={`pointer-events-none absolute right-0 top-0 z-20 flex h-full w-[38%] items-center justify-end px-5 transition-all duration-1000 md:px-10 lg:px-14 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto w-full max-w-sm space-y-3">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Customer voices</p>
        {display.map((review) => (
          <article key={review.id} className="border border-white/10 bg-black/45 p-4 backdrop-blur-md">
            <div className="text-sm text-[#D4AF37]">{"★".repeat(review.rating)}</div>
            {review.comment ? (
              <p className="mt-2 text-xs leading-relaxed text-white/75 line-clamp-4">{review.comment}</p>
            ) : null}
            <p className="mt-3 text-xs font-medium text-white">{review.user.name}</p>
            {"product" in review && review.product ? (
              <Link
                to={`/product/${review.product.slug}`}
                className="mt-1 block text-[10px] text-[#D4AF37]/80 hover:text-[#D4AF37]"
              >
                {review.product.name}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
