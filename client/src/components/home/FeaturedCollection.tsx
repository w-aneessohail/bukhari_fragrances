import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fetchFeaturedProducts } from "../../services/productService";
import { useCartStore } from "../../store/cartStore";

export default function FeaturedCollection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const [addingId, setAddingId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["featured-carousel"],
    queryFn: fetchFeaturedProducts
  });

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
  };

  const handleQuickAdd = async (productId: string) => {
    setAddingId(productId);
    try {
      await addItem({ productId, quantity: 1 });
    } finally {
      setAddingId(null);
    }
  };

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="overflow-hidden bg-bg-primary py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-heading text-4xl text-accent-gold">Featured collection</h2>
          <p className="mt-2 text-text-secondary">Drag or use arrows to explore our signature line.</p>
        </motion.div>

        <div className="relative mt-10">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card px-3 py-2 md:block"
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-border bg-card px-3 py-2 md:block"
            aria-label="Scroll right"
          >
            →
          </button>

          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-thin"
          >
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-96 w-72 shrink-0 animate-pulse rounded-2xl bg-bg-secondary" />
                ))
              : products.map((product, index) => (
                  <article
                    key={product.id}
                    className="group w-72 shrink-0 snap-start rounded-2xl border border-border bg-card p-4 transition hover:border-accent-gold"
                    style={{ transform: `perspective(900px) rotateY(${index % 2 === 0 ? -2 : 2}deg)` }}
                  >
                    <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-xl">
                      {product.mainImage ? (
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="h-80 w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-80 items-center justify-center bg-bg-secondary text-sm text-text-secondary">
                          No image
                        </div>
                      )}
                    </Link>
                    <div className="mt-4">
                      <Link to={`/product/${product.slug}`} className="font-heading text-lg hover:text-accent-gold">
                        {product.name}
                      </Link>
                      <p className="mt-1 text-accent-gold">Rs. {(product.salePrice ?? product.price).toLocaleString()}</p>
                      <button
                        type="button"
                        disabled={addingId === product.id || product.stock < 1}
                        onClick={() => handleQuickAdd(product.id)}
                        className="mt-3 w-full rounded-lg border border-border py-2 text-sm hover:border-accent-gold hover:text-accent-gold disabled:opacity-50"
                      >
                        {addingId === product.id ? "Adding…" : "Quick add"}
                      </button>
                    </div>
                  </article>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
