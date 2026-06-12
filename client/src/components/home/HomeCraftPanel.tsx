import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  CRAFT_BEAT_COUNT,
  beatSlotVisual,
  craftPanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";

const CRAFT_PILLARS = [
  {
    title: "Oud",
    subtitle: "Foundation",
    body: "Deep resinous oud anchors our attars — warm, lasting, and unmistakably Eastern.",
    detail: "We source oud chips aged for years, distilled slowly to preserve smoky depth without harshness."
  },
  {
    title: "Rose Attar",
    subtitle: "Heart",
    body: "Hand-distilled rose from the valleys — the soul of Lahore's perfumery tradition.",
    detail: "Petals are picked at dawn and steam-distilled the same day — a process unchanged for decades."
  },
  {
    title: "Amber & Musk",
    subtitle: "Signature",
    body: "A velvet dry-down that lingers on skin — crafted for those who wear grace.",
    detail: "Our amber accord is built in-house — resinous, slightly sweet, and balanced with clean white musk."
  }
] as const;

export default function HomeCraftPanel() {
  const { progress } = useScrollExperience();
  const opacity = craftPanelOpacity(progress);
  const local = sectionProgress(progress, "CRAFT");

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity, visibility: opacity > 0.01 ? "visible" : "hidden" }}
    >
      <div className="flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="relative w-[30%] max-w-xs min-h-[14rem] md:max-w-sm">
          {CRAFT_PILLARS.map((pillar, i) => {
            const visual = beatSlotVisual(local, i, CRAFT_BEAT_COUNT);
            const slotOp = visual.opacity * opacity;
            if (slotOp <= 0.005) return null;
            return (
              <div
                key={pillar.title}
                className="absolute inset-0 border border-white/10 bg-black/40 p-6 backdrop-blur-md md:p-8"
                style={{
                  opacity: slotOp,
                  transform: `translateX(${-visual.slide * 20}px)`
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#D4AF37]/80">{pillar.subtitle}</p>
                <h3 className="mt-2 font-serif text-2xl text-white md:text-3xl">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{pillar.body}</p>
              </div>
            );
          })}
        </div>

        <div className="w-[40%] shrink-0" aria-hidden />

        <div className="relative w-[30%] max-w-xs min-h-[14rem] md:max-w-sm">
          {CRAFT_PILLARS.map((pillar, i) => {
            const visual = beatSlotVisual(local, i, CRAFT_BEAT_COUNT);
            const slotOp = visual.opacity * opacity;
            if (slotOp <= 0.005) return null;
            return (
              <div
                key={`${pillar.title}-detail`}
                className="absolute inset-0 flex flex-col justify-center border border-white/10 bg-black/35 p-6 backdrop-blur-md md:p-8"
                style={{
                  opacity: slotOp,
                  transform: `translateX(${visual.slide * 20}px)`
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">In our atelier</p>
                <p className="mt-4 text-sm leading-relaxed text-white/75 md:text-base">{pillar.detail}</p>
              </div>
            );
          })}
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-center text-[10px] uppercase tracking-[0.45em] text-white/35 md:bottom-16">
        The art of scent
      </p>
    </div>
  );
}
