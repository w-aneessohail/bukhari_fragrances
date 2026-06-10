import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { searchProducts } from "../../../services/productService";

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

type SearchBarProps = {
  variant?: "default" | "light";
};

export default function SearchBar({ variant = "default" }: SearchBarProps) {
  const isLight = variant === "light";
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query.trim(), 300);

  const { data, isFetching } = useQuery({
    queryKey: ["navbar-search", debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery, 1, 5),
    enabled: debouncedQuery.length >= 2
  });

  const results = data?.data ?? [];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="relative hidden md:block">
      <form onSubmit={handleSubmit}>
        <input
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => window.setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search fragrances…"
          className={`w-48 rounded-md border px-3 py-1.5 text-sm transition focus:w-64 lg:w-56 lg:focus:w-72 ${
            isLight
              ? "border-white/20 bg-white/10 text-[#F5EDD6] placeholder:text-[#F5EDD6]/50"
              : "border-border bg-input text-text-primary"
          }`}
          aria-label="Search fragrances"
          aria-expanded={isOpen && debouncedQuery.length >= 2}
        />
      </form>

      {isOpen && debouncedQuery.length >= 2 ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-border bg-card p-3 shadow-luxury">
          {isFetching ? (
            <p className="px-2 py-3 text-sm text-text-secondary">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-2 py-3 text-sm text-text-secondary">No results found.</p>
          ) : (
            <ul className="space-y-1">
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    className="block rounded-lg px-2 py-2 text-sm hover:bg-bg-secondary"
                    onClick={() => setIsOpen(false)}
                  >
                    {product.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => navigate(`/search?q=${encodeURIComponent(debouncedQuery)}`)}
            className="mt-2 w-full rounded-lg border border-border px-3 py-2 text-xs hover:border-accent-gold hover:text-accent-gold"
          >
            View all results
          </button>
        </div>
      ) : null}
    </div>
  );
}
