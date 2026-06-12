import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBestsellerProducts } from "../../../services/productService";
import { m } from "./modernTheme";
import Reveal from "./Reveal";

const LAYERS = ["Top", "Heart", "Base"] as const;

const FALLBACK_NOTES = {
  top: ["Damask Rose", "Saffron", "Bergamot"],
  heart: ["Oud", "Jasmine", "Amber"],
  base: ["Musk", "Sandalwood", "Vanilla"]
};

export default function ModernFragranceLayers() {
  const [activeLayer, setActiveLayer] = useState<(typeof LAYERS)[number]>("Top");

  const { data: products = [] } = useQuery({
    queryKey: ["home-bestsellers"],
    queryFn: fetchBestsellerProducts,
    staleTime: 60_000
  });

  const product = products[0];
  const notes = {
    top: product?.scentFamily ? [product.scentFamily, product.concentration ?? "Eau de Parfum"] : FALLBACK_NOTES.top,
    heart: FALLBACK_NOTES.heart,
    base: FALLBACK_NOTES.base
  };

  const activeNotes =
    activeLayer === "Top" ? notes.top : activeLayer === "Heart" ? notes.heart : notes.base;

  return (
    <section className={m.section}>
      <div className={`${m.sectionInner} grid gap-10 md:grid-cols-2 md:items-center`}>
        <Reveal>
          <p className={m.eyebrow}>Composition</p>
          <h2 className={m.h2}>Peel back the layers</h2>
          <p className={`mt-4 max-w-md ${m.body}`}>
            The same note storytelling as our scroll experience — tap a layer to explore how a
            signature Bukhari scent unfolds on skin.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {LAYERS.map((layer) => (
              <button
                key={layer}
                type="button"
                onClick={() => setActiveLayer(layer)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
                  activeLayer === layer
                    ? "border-accent-gold bg-accent-gold text-bg-primary"
                    : "border-border text-text-secondary hover:border-accent-gold/50 hover:text-text-primary"
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className={`relative overflow-hidden p-6 md:p-8 ${m.card}`}>
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-gold/10 blur-2xl" />
            <p className={`text-[10px] uppercase tracking-[0.35em] ${m.gold}`}>{activeLayer} notes</p>
            <h3 className="mt-3 font-heading text-2xl text-text-primary md:text-3xl">
              {product?.name ?? "Bukhari Signature"}
            </h3>
            <ul className="mt-6 space-y-3">
              {activeNotes.map((note) => (
                <li
                  key={note}
                  className={`flex items-center gap-3 border-b ${m.divider} pb-3 text-sm text-text-primary last:border-0 last:pb-0`}
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-gold" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
