import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  categoriesPanelOpacity,
  isInSection,
  popularPanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";
import { fetchBestsellerProducts, fetchCategories } from "../../services/productService";
import HomeNotesPanel from "./HomeNotesPanel";
import HomeReviewsPanel from "./HomeReviewsPanel";

function formatPrice(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

const FALLBACK_CATEGORIES = [
  {
    name: "Signature Eau De Parfum",
    slug: "signature-eau-de-parfum",
    description: "Everyday luxury fragrances by Bukhari Perfumes.",
    image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Oud & Attar",
    slug: "oud-attar",
    description: "Traditional and modern oud-forward concentrated oils.",
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Niche Collection",
    slug: "niche-collection",
    description: "Small-batch artistic creations from Bukhari Perfumes.",
    image: "https://images.unsplash.com/photo-1591375372226-3531cf2bdf4f?auto=format&fit=crop&w=600&q=80"
  }
];

function Panel({
  visible,
  children
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 transition-all duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function ProductCard({
  product,
  align
}: {
  product: {
    name: string;
    slug: string;
    mainImage: string | null;
    price: number;
    salePrice: number | null;
    scentFamily?: string;
  };
  align: "left" | "right";
}) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className={`pointer-events-auto block w-52 border border-white/15 bg-black/50 p-4 backdrop-blur-md transition hover:border-[#D4AF37]/50 md:w-64 lg:w-72 ${
        align === "left" ? "mr-auto" : "ml-auto"
      }`}
    >
      {product.mainImage ? (
        <img src={product.mainImage} alt={product.name} className="mb-4 h-36 w-full object-cover md:h-40" />
      ) : (
        <div className="mb-4 flex h-36 items-center justify-center bg-white/5 text-[10px] uppercase tracking-widest text-white/30 md:h-40">
          Bukhari
        </div>
      )}
      <p className="font-serif text-base text-white md:text-lg">{product.name}</p>
      {product.scentFamily ? (
        <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/45">{product.scentFamily}</p>
      ) : null}
      <p className="mt-3 text-sm text-[#D4AF37]">{formatPrice(product.salePrice ?? product.price)}</p>
    </Link>
  );
}

export default function HomeScrollPanels() {
  const { progress } = useScrollExperience();

  const { data: categories = FALLBACK_CATEGORIES } = useQuery({
    queryKey: ["home-categories"],
    queryFn: fetchCategories,
    staleTime: 60_000
  });

  const { data: bestsellers = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const products = bestsellers.length > 0 ? bestsellers : [];
  const popularPair = [products[0], products[1]].filter(Boolean);

  const heroVisible = isInSection(progress, "HERO");
  const notesVisible = isInSection(progress, "NOTES");

  const heroT = sectionProgress(progress, "HERO");
  const categoriesOp = categoriesPanelOpacity(progress);
  const popularOp = popularPanelOpacity(progress);

  return (
    <>
      {/* Screen 1 — hero text high left, bottle far right */}
      <Panel visible={heroVisible}>
        <div
          className="flex h-full items-start px-6 pt-28 md:px-14 md:pt-32 lg:px-20 lg:pt-36"
          style={{ opacity: 1 - heroT * 0.35 }}
        >
          <div className="pointer-events-none w-full max-w-md lg:max-w-lg">
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/40">Bukhari Perfumes</p>
            <h1 className="mt-5 font-sans text-4xl font-light leading-[1.1] text-white md:text-5xl lg:text-6xl">
              Fragrance is what you
              <br />
              <span className="font-serif italic text-[#D4AF37]">see, feel, wear.</span>
            </h1>
          </div>
        </div>
      </Panel>

      {/* Screen 2 — categories right, fully visible by 20% scroll */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{ opacity: categoriesOp, visibility: categoriesOp > 0.01 ? "visible" : "hidden" }}
      >
        <div className="flex h-full items-center justify-end px-6 md:px-14 lg:px-20">
          <div className="pointer-events-auto w-full max-w-sm text-white">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/50">Collections</p>
            <h2 className="mt-3 font-sans text-2xl font-light md:text-4xl">Categories we craft</h2>
            <div className="mt-6 space-y-2">
              {categories.slice(0, 3).map((category) => (
                <Link
                  key={category.slug}
                  to={`/shop?category=${category.slug}`}
                  className="group flex items-center gap-3 border-b border-white/10 py-3 transition hover:border-[#D4AF37]/40"
                >
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="h-11 w-11 object-cover opacity-85" />
                  ) : (
                    <div className="h-11 w-11 bg-white/5" />
                  )}
                  <div>
                    <p className="text-sm text-white group-hover:text-[#D4AF37]">{category.name}</p>
                    {category.description ? (
                      <p className="text-[11px] text-white/40 line-clamp-1">{category.description}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Screen 3 — petal center, larger products left & right */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-700"
        style={{ opacity: popularOp, visibility: popularOp > 0.01 ? "visible" : "hidden" }}
      >
        <div className="flex h-full items-center px-4 md:px-8 lg:px-12">
          <div className="flex w-full items-center justify-between gap-2">
            <div className="w-[30%] max-w-[18rem]">
              {popularPair[0] ? <ProductCard product={popularPair[0]} align="left" /> : null}
            </div>
            <div className="w-[30%] max-w-[18rem]">
              {popularPair[1] ? <ProductCard product={popularPair[1]} align="right" /> : null}
            </div>
          </div>
        </div>
        <p className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/40">
          Most loved
        </p>
      </div>

      {/* Screen 4 — leaf center, notes left, reviews right */}
      <HomeNotesPanel visible={notesVisible} />
      <HomeReviewsPanel visible={notesVisible} />
    </>
  );
}
