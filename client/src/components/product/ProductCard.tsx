import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { ProductSummary } from "../../types/product.types";

type ProductCardProps = {
  product: ProductSummary;
  tone?: "default" | "experience";
};

export default function ProductCard({ product, tone = "experience" }: ProductCardProps) {
  const hasSale = product.salePrice !== null && product.salePrice < product.price;
  const isExperience = tone === "experience";

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`group overflow-hidden rounded-xl border border-border bg-card shadow-luxury ${
        isExperience ? "backdrop-blur-md" : ""
      }`}
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-bg-secondary">
          {product.mainImage ? (
            <img
              src={product.mainImage}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text-secondary">
              No image
            </div>
          )}
          {hasSale ? (
            <span className="absolute left-3 top-3 rounded bg-accent-gold px-2 py-1 text-xs font-semibold text-bg-primary">
              Sale
            </span>
          ) : null}
        </div>

        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-text-secondary">{product.scentFamily}</p>
          <h3 className="mt-1 font-heading text-xl text-text-primary">{product.name}</h3>
          <p className="mt-2 text-sm text-text-secondary">
            {product.avgRating.toFixed(1)} ★ ({product.reviewCount})
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="font-semibold text-accent-gold">
              Rs. {(hasSale ? product.salePrice : product.price)?.toLocaleString()}
            </span>
            {hasSale ? (
              <span className="text-sm text-text-secondary line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
