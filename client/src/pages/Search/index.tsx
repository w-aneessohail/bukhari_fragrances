import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import PageMeta from "../../components/seo/PageMeta";
import PageLoadingScreen from "../../components/ui/PageLoadingScreen";
import { searchProducts } from "../../services/productService";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q")?.trim() ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["search-page", query],
    queryFn: () => searchProducts(query, 1, 24),
    enabled: query.length > 0
  });

  const products = data?.data ?? [];

  if (query && isLoading) {
    return <PageLoadingScreen label="Searching" />;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <PageMeta title={`Search: ${query || "Fragrances"}`} path={`/search?q=${encodeURIComponent(query)}`} />

      <h1 className="font-heading text-4xl text-accent-gold">Search results</h1>
      <p className="mt-2 text-text-secondary">
        {query ? `Showing results for “${query}”` : "Enter a search term from the navbar."}
      </p>

      {!query ? (
        <p className="mt-10 text-text-secondary">Try searching for oud, rose, amber, or attar.</p>
      ) : products.length === 0 ? (
        <p className="mt-10 text-text-secondary">No fragrances matched your search.</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
