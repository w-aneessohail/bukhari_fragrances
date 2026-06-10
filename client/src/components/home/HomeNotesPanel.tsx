import { useQuery } from "@tanstack/react-query";
import { fetchBestsellerProducts } from "../../services/productService";

const DEFAULT_NOTES = {
  name: "Bukhari Signature",
  top: ["Damask Rose", "Saffron", "Bergamot"],
  heart: ["Oud", "Jasmine", "Amber"],
  base: ["Musk", "Sandalwood", "Vanilla"]
};

export default function HomeNotesPanel({ visible }: { visible: boolean }) {
  const { data: products = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const featured = products[0];
  const notes = featured
    ? {
        name: featured.name,
        top: featured.scentFamily ? [featured.scentFamily, featured.concentration] : DEFAULT_NOTES.top,
        heart: featured.category ? [featured.category.name] : DEFAULT_NOTES.heart,
        base: ["Musk", "Sandalwood", "Amber"]
      }
    : DEFAULT_NOTES;

  return (
    <div
      className={`pointer-events-none absolute left-0 top-0 z-20 flex h-full w-[38%] items-center px-5 transition-all duration-1000 md:px-10 lg:px-14 ${
        visible ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
      }`}
    >
      <div className="pointer-events-auto max-w-sm border border-white/10 bg-black/45 p-5 backdrop-blur-md md:p-6">
        <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Fragrance notes</p>
        <h3 className="mt-2 font-serif text-xl text-white md:text-2xl">{notes.name}</h3>
        <div className="mt-5 space-y-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]/80">Top</p>
            <p className="mt-1 text-sm text-white/80">{notes.top.join(" · ")}</p>
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
    </div>
  );
}
