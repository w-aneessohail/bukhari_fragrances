import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  POPULAR_BEAT_COUNT,
  beatSlotVisual,
  popularPanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";
import { fetchBestsellerProducts } from "../../services/productService";

type Product = {
  name: string;
  slug: string;
  mainImage: string | null;
  price: number;
  salePrice: number | null;
  scentFamily?: string;
  concentration?: string;
  description?: string;
};

const FALLBACK_PRODUCTS: Product[] = [
  {
    name: "Bukhari Oud Royale",
    slug: "bukhari-oud-royale",
    mainImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    price: 12500,
    salePrice: null,
    scentFamily: "Oud",
    concentration: "Eau de Parfum",
    description: "A regal oud composition with saffron warmth."
  },
  {
    name: "Rosewood Attar",
    slug: "rosewood-attar",
    mainImage: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    price: 8900,
    salePrice: null,
    scentFamily: "Floral",
    concentration: "Attar",
    description: "Hand-distilled rose with woody depth."
  },
  {
    name: "Amber Noir",
    slug: "amber-noir",
    mainImage: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80",
    price: 9900,
    salePrice: 8900,
    scentFamily: "Amber",
    concentration: "Eau de Parfum",
    description: "Dark amber resin wrapped in soft musk."
  },
  {
    name: "Saffron Elixir",
    slug: "saffron-elixir",
    mainImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?auto=format&fit=crop&w=600&q=80",
    price: 14200,
    salePrice: null,
    scentFamily: "Spicy",
    concentration: "Parfum",
    description: "Precious saffron over a leather-oud base."
  },
  {
    name: "Velvet Musk",
    slug: "velvet-musk",
    mainImage: "https://images.unsplash.com/photo-1591375372226-3531cf2bdf4f?auto=format&fit=crop&w=600&q=80",
    price: 7600,
    salePrice: null,
    scentFamily: "Musk",
    concentration: "Eau de Parfum",
    description: "Clean musk with a powdery floral heart."
  },
  {
    name: "Jasmine Nights",
    slug: "jasmine-nights",
    mainImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    price: 6800,
    salePrice: null,
    scentFamily: "Floral",
    concentration: "Eau de Toilette",
    description: "Night-blooming jasmine on warm sandalwood."
  }
];

function formatPrice(amount: number) {
  return `PKR ${amount.toLocaleString("en-PK")}`;
}

function padProducts(list: Product[]) {
  const out = [...list];
  let i = 0;
  while (out.length < POPULAR_BEAT_COUNT * 2) {
    out.push(FALLBACK_PRODUCTS[i % FALLBACK_PRODUCTS.length]);
    i += 1;
  }
  return out;
}

function ProductSide({
  product,
  side,
  visual
}: {
  product: Product;
  side: "left" | "right";
  visual: { opacity: number; slide: number };
}) {
  const slideX = visual.slide * (side === "left" ? -20 : 20);

  return (
    <div
      className={`flex w-[24%] max-w-[13rem] flex-col gap-2 md:max-w-[14rem] ${
        side === "left" ? "items-end pr-1" : "items-start pl-1"
      }`}
      style={{
        opacity: visual.opacity,
        transform: `translateX(${slideX}px)`,
        pointerEvents: visual.opacity > 0.4 ? "auto" : "none"
      }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block w-full border border-white/15 bg-black/50 p-3 backdrop-blur-md transition-colors hover:border-[#D4AF37]/50 md:p-4"
      >
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="mb-3 h-28 w-full object-cover md:h-32"
            loading="lazy"
          />
        ) : (
          <div className="mb-3 flex h-28 items-center justify-center bg-white/5 text-[10px] uppercase tracking-widest text-white/30 md:h-32">
            Bukhari
          </div>
        )}
        <p className="font-serif text-sm text-white md:text-base">{product.name}</p>
        <p className="mt-2 text-sm text-[#D4AF37]">{formatPrice(product.salePrice ?? product.price)}</p>
      </Link>
      <div className="w-full border border-white/10 bg-black/35 px-3 py-2.5 backdrop-blur-sm md:px-4 md:py-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-[#D4AF37]/75">
          {product.scentFamily ?? "Signature"} · {product.concentration ?? "Eau de Parfum"}
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-white/65 line-clamp-2">
          {product.description ?? "A signature Bukhari composition crafted in Lahore."}
        </p>
      </div>
    </div>
  );
}

export default function HomePopularPanel() {
  const { progress } = useScrollExperience();
  const panelOp = popularPanelOpacity(progress);
  const local = sectionProgress(progress, "POPULAR");

  const { data: bestsellers = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const products = padProducts(bestsellers.length > 0 ? (bestsellers as Product[]) : FALLBACK_PRODUCTS);

  if (panelOp <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity: panelOp, visibility: panelOp > 0.01 ? "visible" : "hidden" }}
    >
      <div className="relative flex h-full items-center justify-center px-3 md:px-6 lg:px-10">
        {Array.from({ length: POPULAR_BEAT_COUNT }, (_, i) => {
          const visual = beatSlotVisual(local, i, POPULAR_BEAT_COUNT);
          if (visual.opacity <= 0.005) return null;
          return (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-between px-3 md:px-6 lg:px-10"
            >
              <ProductSide product={products[i * 2]} side="left" visual={visual} />
              <div className="w-[38%] shrink-0" aria-hidden />
              <ProductSide product={products[i * 2 + 1]} side="right" visual={visual} />
            </div>
          );
        })}
      </div>
      <p className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 text-center font-serif text-2xl tracking-[0.15em] text-white md:bottom-20 md:text-4xl lg:text-5xl">
        Most Loved
      </p>
      <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/30 md:bottom-10">
        Scroll to discover more
      </p>
    </div>
  );
}
