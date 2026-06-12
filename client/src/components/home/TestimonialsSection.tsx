import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { fetchFeaturedReviews } from "../../services/reviewService";

type TestimonialsSectionProps = {
  tone?: "default" | "experience";
};

export default function TestimonialsSection({ tone = "experience" }: TestimonialsSectionProps) {
  const isExperience = tone === "experience";
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["featured-reviews"],
    queryFn: fetchFeaturedReviews
  });

  const displayReviews =
    reviews.length > 0
      ? reviews
      : [
          {
            id: "1",
            rating: 5,
            comment: "Bukhari Oud Royale is my signature scent — rich, lasting, and unmistakably premium.",
            isVerified: true,
            helpfulCount: 12,
            createdAt: "",
            user: { id: "1", name: "Ayesha K." },
            product: { id: "1", name: "Bukhari Oud Royale", slug: "bukhari-oud-royale" }
          },
          {
            id: "2",
            rating: 5,
            comment: "Fast delivery in Lahore and the packaging feels truly luxurious.",
            isVerified: true,
            helpfulCount: 8,
            createdAt: "",
            user: { id: "2", name: "Hassan R." },
            product: { id: "2", name: "Rosewood Attar", slug: "rosewood-attar" }
          },
          {
            id: "3",
            rating: 4,
            comment: "The amber collection is perfect for evening wear. Will order again.",
            isVerified: false,
            helpfulCount: 5,
            createdAt: "",
            user: { id: "3", name: "Sana M." },
            product: { id: "3", name: "Amber Nocturne", slug: "amber-nocturne" }
          }
        ];

  return (
    <section
      className={`overflow-hidden py-16 ${isExperience ? "border-b border-border" : "bg-bg-secondary"}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-heading text-3xl text-accent-gold">What our customers say</h2>
        <p className="mt-2 text-text-secondary">
          Real experiences from fragrance lovers across Pakistan.
        </p>
      </div>

      {isLoading ? (
        <div
          className="mx-auto mt-8 h-32 max-w-7xl animate-pulse rounded-xl bg-card px-4 md:px-6"
        />
      ) : (
        <div className="mt-10 space-y-6">
          {[0, 1].map((row) => (
            <div key={row} className="overflow-hidden">
              <motion.div
                animate={{ x: row === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                transition={{ repeat: Infinity, duration: 35, ease: "linear" }}
                className="flex w-max gap-4 hover:[animation-play-state:paused]"
              >
                {[...displayReviews, ...displayReviews].map((review, index) => (
                  <article
                    key={`${review.id}-${row}-${index}`}
                    className="w-80 shrink-0 rounded-xl border border-border bg-card p-5 backdrop-blur-md"
                  >
                    <div className="text-accent-gold">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </div>
                    {review.comment ? (
                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                        {review.comment}
                      </p>
                    ) : null}
                    <p className="mt-4 text-sm font-medium text-text-primary">
                      {review.user.name}
                    </p>
                    {review.product ? (
                      <Link
                        to={`/product/${review.product.slug}`}
                        className="mt-1 block text-xs text-accent-gold underline"
                      >
                        {review.product.name}
                      </Link>
                    ) : null}
                  </article>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
