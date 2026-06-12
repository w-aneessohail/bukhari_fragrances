import { useQuery } from "@tanstack/react-query";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  NOTES_BEAT_COUNT,
  beatSlotVisual,
  notesPanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";
import { fetchBestsellerProducts } from "../../services/productService";

const NOTE_VARIANTS = [
  {
    name: "Bukhari Signature",
    top: ["Damask Rose", "Saffron", "Bergamot"],
    heart: ["Oud", "Jasmine", "Amber"],
    base: ["Musk", "Sandalwood", "Vanilla"]
  },
  {
    name: "Oud Royale",
    top: ["Saffron", "Cardamom", "Bergamot"],
    heart: ["Oud", "Rose", "Leather"],
    base: ["Amber", "Musk", "Patchouli"]
  },
  {
    name: "Rose Attar",
    top: ["Bulgarian Rose", "Pink Pepper", "Citrus"],
    heart: ["Jasmine", "Peony", "Oud"],
    base: ["Sandalwood", "Vanilla", "White Musk"]
  }
];

function buildNotesFromProduct(
  product:
    | {
        name: string;
        scentFamily?: string;
        concentration?: string;
        category?: { name: string } | null;
      }
    | undefined,
  fallback: (typeof NOTE_VARIANTS)[number]
) {
  if (!product) return fallback;
  return {
    name: product.name,
    top: product.scentFamily ? [product.scentFamily, product.concentration ?? "Eau de Parfum"] : fallback.top,
    heart: product.category ? [product.category.name, "Jasmine", "Amber"] : fallback.heart,
    base: fallback.base
  };
}

export default function HomeNotesPanel() {
  const { progress } = useScrollExperience();
  const opacity = notesPanelOpacity(progress);
  const local = sectionProgress(progress, "NOTES");

  const { data: products = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute left-0 top-0 z-20 flex h-full w-[30%] max-w-xs items-center pl-5 pr-2 md:max-w-sm md:pl-10 md:pr-3 lg:pl-14"
      style={{ opacity, visibility: opacity > 0.01 ? "visible" : "hidden" }}
    >
      <div className="relative min-h-[18rem] w-full md:min-h-[20rem]">
        {NOTE_VARIANTS.map((fallback, i) => {
          const notes = buildNotesFromProduct(products[i], fallback);
          const visual = beatSlotVisual(local, i, NOTES_BEAT_COUNT);
          const slotOp = visual.opacity * opacity;
          if (slotOp <= 0.005) return null;
          return (
            <div
              key={fallback.name}
              className="pointer-events-auto absolute inset-0 border border-white/10 bg-black/45 p-5 backdrop-blur-md md:p-6"
              style={{
                opacity: slotOp,
                transform: `translateX(${-visual.slide * 16}px)`
              }}
            >
              <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Fragrance notes</p>
              <h3 className="mt-2 font-serif text-xl text-white md:text-2xl">{notes.name}</h3>
              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80">Top</p>
                  <p className="mt-1 text-sm text-white/80">{notes.top.filter(Boolean).join(" · ")}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80">Heart</p>
                  <p className="mt-1 text-sm text-white/80">{notes.heart.join(" · ")}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80">Base</p>
                  <p className="mt-1 text-sm text-white/80">{notes.base.join(" · ")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
