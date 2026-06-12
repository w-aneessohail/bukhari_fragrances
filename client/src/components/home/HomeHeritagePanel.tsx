import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  HERITAGE_BEAT_COUNT,
  beatSlotVisual,
  heritagePanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";

const MILESTONES = [
  {
    year: "1987",
    title: "First atelier",
    body: "A small workshop in Lahore's old city — blending attar by hand for families who valued tradition."
  },
  {
    year: "2005",
    title: "Signature oud",
    body: "Our oud-forward compositions gained renown across Punjab — depth, warmth, and lasting sillage."
  },
  {
    year: "Today",
    title: "Modern heritage",
    body: "Same craft, refined for a new generation — niche collections and bespoke blends from Lahore."
  }
] as const;

export default function HomeHeritagePanel() {
  const { progress } = useScrollExperience();
  const opacity = heritagePanelOpacity(progress);
  const local = sectionProgress(progress, "HERITAGE");

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity, visibility: opacity > 0.01 ? "visible" : "hidden" }}
    >
      <div className="flex h-full items-center px-6 md:px-12 lg:px-20">
        {/* Left — always visible heritage story */}
        <div className="w-[30%] max-w-xs border border-white/10 bg-black/40 p-6 backdrop-blur-md md:max-w-sm md:p-8">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/80">Our heritage</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-white md:text-4xl">Rooted in Lahore</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
            Three generations of perfumers have shaped Bukhari — from attar distillers in the walled city to a house
            known for oud, rose, and compositions that honour Pakistani craft.
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/35">Est. Lahore · Pakistan</p>
        </div>

        <div className="w-[40%] shrink-0" aria-hidden />

        {/* Right — milestone timeline, scroll-driven highlight */}
        <div className="relative w-[30%] max-w-xs min-h-[14rem] md:max-w-sm">
          {MILESTONES.map((item, i) => {
            const visual = beatSlotVisual(local, i, HERITAGE_BEAT_COUNT);
            const slotOp = visual.opacity * opacity;
            if (slotOp <= 0.005) return null;
            return (
              <div
                key={item.year}
                className="absolute inset-0 border border-white/10 bg-black/40 p-6 backdrop-blur-md md:p-8"
                style={{
                  opacity: slotOp,
                  transform: `translateX(${visual.slide * 20}px)`
                }}
              >
                <p className="font-serif text-4xl text-[#D4AF37]/90 md:text-5xl">{item.year}</p>
                <h3 className="mt-3 text-lg font-light text-white md:text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{item.body}</p>
              </div>
            );
          })}
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em] text-white/35 md:bottom-16">
        A legacy of scent
      </p>
    </div>
  );
}
