import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import ProductCard from "../product/ProductCard";
import type { ProductSummary } from "../../types/product.types";

type ProductSectionProps = {
  title: string;
  subtitle?: string;
  queryKey: string;
  fetcher: () => Promise<ProductSummary[]>;
  shopLink?: string;
};

export default function ProductSection({ title, subtitle, queryKey, fetcher, shopLink }: ProductSectionProps) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: [queryKey],
    queryFn: fetcher
  });

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl text-accent-gold md:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-2 text-text-secondary">{subtitle}</p> : null}
        </div>
        {shopLink ? (
          <Link to={shopLink} className="text-sm text-accent-gold underline hover:opacity-80">
            View all
          </Link>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-xl bg-bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
