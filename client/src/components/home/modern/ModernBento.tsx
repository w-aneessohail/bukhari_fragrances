import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchBestsellerProducts, fetchCategories } from "../../../services/productService";
import { m } from "./modernTheme";
import Reveal from "./Reveal";

export default function ModernBento() {
  const { data: categories = [] } = useQuery({
    queryKey: ["home-categories"],
    queryFn: fetchCategories,
    staleTime: 60_000
  });

  const { data: bestsellers = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const topCategories = categories.filter((c) => !c.parentId).slice(0, 2);
  const heroProduct = bestsellers[0];

  return (
    <section className={`${m.section} ${m.sectionInner} md:py-24`}>
      <Reveal>
        <p className={m.eyebrow}>Curated edit</p>
        <h2 className={m.h2}>Shop the mood</h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-12 md:grid-rows-2 md:gap-5">
        {heroProduct ? (
          <Reveal className="md:col-span-7 md:row-span-2">
            <Link
              to={`/product/${heroProduct.slug}`}
              className={`group relative flex h-full min-h-[20rem] overflow-hidden ${m.card} md:min-h-[28rem]`}
            >
              {heroProduct.mainImage ? (
                <img
                  src={heroProduct.mainImage}
                  alt={heroProduct.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/35 to-transparent" />
              <div className="relative mt-auto p-6 md:p-8">
                <p className={`text-[10px] uppercase tracking-[0.3em] ${m.gold}`}>Most loved</p>
                <h3 className="mt-2 font-heading text-3xl text-text-primary md:text-4xl">{heroProduct.name}</h3>
                <p className={`mt-2 text-sm ${m.muted}`}>{heroProduct.scentFamily}</p>
              </div>
            </Link>
          </Reveal>
        ) : null}

        {topCategories.map((category, index) => (
          <Reveal key={category.id} delay={0.1 + index * 0.06} className="md:col-span-5">
            <Link
              to={`/shop?category=${category.slug}`}
              className={`group flex h-full min-h-[12rem] overflow-hidden ${m.card}`}
            >
              {category.image ? (
                <div className="w-2/5 shrink-0 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="flex flex-col justify-center p-5 md:p-6">
                <h3 className={`font-heading text-xl md:text-2xl ${m.gold}`}>{category.name}</h3>
                {category.description ? (
                  <p className={`mt-2 text-sm ${m.muted} line-clamp-2`}>{category.description}</p>
                ) : null}
              </div>
            </Link>
          </Reveal>
        ))}

        <Reveal delay={0.2} className="md:col-span-5">
          <Link
            to="/shop"
            className="flex h-full min-h-[10rem] flex-col justify-center rounded-2xl border border-dashed border-accent-gold/35 bg-card p-6 backdrop-blur-sm transition hover:border-accent-gold/60 hover:bg-bg-secondary"
          >
            <p className={`text-[10px] uppercase tracking-[0.32em] ${m.faint}`}>Full catalogue</p>
            <p className="mt-2 font-heading text-2xl text-text-primary">Browse all fragrances</p>
            <span className={`mt-4 text-sm ${m.gold}`}>Shop now →</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
