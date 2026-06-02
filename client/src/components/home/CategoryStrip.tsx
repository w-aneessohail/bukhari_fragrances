import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchCategories } from "../../services/productService";

export default function CategoryStrip() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories
  });

  const topLevel = categories.filter((category) => !category.parentId);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
      <h2 className="text-center font-heading text-3xl text-text-primary md:text-4xl">Shop by category</h2>
      <p className="mt-2 text-center text-text-secondary">Explore our signature collections</p>

      {isLoading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl bg-bg-secondary" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {topLevel.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="group overflow-hidden rounded-xl border border-border bg-card shadow-luxury transition hover:border-accent-gold"
            >
              {category.image ? (
                <div className="aspect-[16/9] overflow-hidden bg-bg-secondary">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ) : null}
              <div className="p-6 text-center">
                <h3 className="font-heading text-2xl text-accent-gold group-hover:opacity-90">{category.name}</h3>
                {category.description ? (
                  <p className="mt-3 text-sm text-text-secondary line-clamp-2">{category.description}</p>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
