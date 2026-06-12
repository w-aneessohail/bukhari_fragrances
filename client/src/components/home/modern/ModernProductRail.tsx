import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ProductCard from "../../product/ProductCard";
import { fetchBestsellerProducts } from "../../../services/productService";
import { m } from "./modernTheme";
import Reveal from "./Reveal";

export default function ModernProductRail() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["modern-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const items = products.slice(0, 8);

  return (
    <section className={`${m.section} ${m.sectionInner} md:py-24`}>
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={m.eyebrow}>Bestsellers</p>
          <h2 className={m.h2}>Most loved in Lahore</h2>
        </div>
        <Link to="/shop?sort=bestseller" className={`${m.gold} text-sm font-medium hover:opacity-80`}>
          View all →
        </Link>
      </Reveal>

      {isLoading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((product, index) => (
            <Reveal key={product.id} delay={index * 0.05}>
              <ProductCard product={product} tone="experience" />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
