import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import FilterSidebar from "../../components/shop/FilterSidebar";
import ProductCard from "../../components/product/ProductCard";
import { fetchCategories, fetchProducts } from "../../services/productService";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filters = useMemo(
    () => ({
      category: searchParams.get("category") ?? undefined,
      gender: searchParams.get("gender") ?? undefined,
      scentFamily: searchParams.get("scentFamily") ?? undefined,
      concentration: searchParams.get("concentration") ?? undefined,
      minPrice: searchParams.get("minPrice") ?? undefined,
      maxPrice: searchParams.get("maxPrice") ?? undefined,
      inStock: searchParams.get("inStock") === "true",
      onSale: searchParams.get("onSale") === "true",
      sort: (searchParams.get("sort") as "price_asc" | "price_desc" | "newest" | "bestseller" | "rating") ?? "newest",
      page: Number(searchParams.get("page") ?? "1")
    }),
    [searchParams]
  );

  const activeFilterCount = [
    filters.category,
    filters.gender,
    filters.scentFamily,
    filters.concentration,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
    filters.onSale
  ].filter(Boolean).length;

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ["products", filters],
    queryFn: () =>
      fetchProducts({
        page: filters.page,
        limit: 12,
        category: filters.category,
        gender: filters.gender,
        scentFamily: filters.scentFamily,
        concentration: filters.concentration,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        inStock: filters.inStock || undefined,
        onSale: filters.onSale || undefined,
        sort: filters.sort
      })
  });

  const products = productsResponse?.data ?? [];
  const pagination = productsResponse?.pagination;

  const updateFilter = (key: string, value: string | boolean | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (value === undefined || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    next.set("page", "1");
    setSearchParams(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (filters.sort) next.set("sort", filters.sort);
    setSearchParams(next);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-4xl text-accent-gold">Shop Bukhari Perfumes</h1>
        <p className="mt-2 text-text-secondary">Explore our curated fragrance collection.</p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="rounded border border-border px-3 py-2 text-sm md:hidden"
          onClick={() => setMobileFiltersOpen((open) => !open)}
        >
          Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ""}
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-text-secondary" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            className="rounded-md border border-border bg-input px-3 py-2 text-sm"
            value={filters.sort}
            onChange={(event) => updateFilter("sort", event.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Best Rated</option>
            <option value="bestseller">Bestsellers</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className={`${mobileFiltersOpen ? "block" : "hidden"} md:block`}>
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={updateFilter}
            onClear={clearFilters}
          />
        </div>

        <div>
          <p className="mb-4 text-sm text-text-secondary">
            Showing {products.length} of {pagination?.totalItems ?? products.length} perfumes
          </p>

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-xl bg-bg-secondary" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 ? (
            <p className="mt-8 text-center text-text-secondary">No products match your filters.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
