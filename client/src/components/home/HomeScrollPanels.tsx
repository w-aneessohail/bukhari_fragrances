import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  categoriesPanelOpacity,
  isInSection,
  sectionProgress
} from "../../constants/scrollSections";
import { fetchCategories } from "../../services/productService";
import HomeCraftPanel from "./HomeCraftPanel";
import HomeHeritagePanel from "./HomeHeritagePanel";
import HomeNotesPanel from "./HomeNotesPanel";
import HomePopularPanel from "./HomePopularPanel";
import HomeReviewsPanel from "./HomeReviewsPanel";
import HomeRitualPanel from "./HomeRitualPanel";

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

function Panel({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-20 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

export default function HomeScrollPanels() {
  const { progress } = useScrollExperience();

  const { data: categories = FALLBACK_CATEGORIES } = useQuery({
    queryKey: ["home-categories"],
    queryFn: fetchCategories,
    staleTime: 60_000
  });

  const heroVisible = isInSection(progress, "HERO");
  const heroT = sectionProgress(progress, "HERO");
  const categoriesOp = categoriesPanelOpacity(progress);

  return (
    <>
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
            <p className="mt-6 text-sm uppercase tracking-[0.35em] text-white/35">Lahore · Pakistan</p>
          </div>
        </div>
      </Panel>

      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{ opacity: categoriesOp, visibility: categoriesOp > 0.01 ? "visible" : "hidden" }}
      >
        <div className="flex h-full items-center justify-end px-6 md:px-14 lg:px-20">
          <div className="pointer-events-auto w-full max-w-sm">
            <p className="text-[10px] uppercase tracking-[0.35em] text-white">Collections</p>
            <h2 className="mt-3 font-sans text-2xl font-light text-white md:text-4xl">Categories we craft</h2>
            <div className="mt-6 space-y-2">
              {categories.slice(0, 3).map((category) => (
                <Link
                  key={category.slug}
                  to={`/shop?category=${category.slug}`}
                  className="group flex items-center gap-3 border-b border-white/15 py-3 transition hover:border-[#D4AF37]/40"
                >
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="h-11 w-11 object-cover" loading="lazy" />
                  ) : (
                    <div className="h-11 w-11 bg-white/5" />
                  )}
                  <div>
                    <p className="text-sm text-white group-hover:text-[#D4AF37]">{category.name}</p>
                    {category.description ? (
                      <p className="text-[11px] text-white/70 line-clamp-1">{category.description}</p>
                    ) : null}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HomePopularPanel />
      <HomeHeritagePanel />
      <HomeCraftPanel />
      <HomeRitualPanel />
      <HomeNotesPanel />
      <HomeReviewsPanel />
    </>
  );
}
