import { useScrollExperience } from "../../context/ScrollExperienceContext";
import {
  RITUAL_BEAT_COUNT,
  beatSlotVisual,
  ritualPanelOpacity,
  sectionProgress
} from "../../constants/scrollSections";

const RITUAL_STEPS = [
  {
    step: "01",
    title: "Apply on pulse points",
    body: "Wrists, neck, and behind the ears — warmth releases the fragrance gradually through the day.",
    tip: "Two sprays are enough for EDP. Attars need only a single drop, warmed between palms."
  },
  {
    step: "02",
    title: "Layer with intention",
    body: "Begin with a light attar base, then a complementary EDP — oud beneath rose, amber beneath musk.",
    tip: "Our staff can suggest pairings from the same scent family for a seamless dry-down."
  },
  {
    step: "03",
    title: "Gift with grace",
    body: "Every Bukhari bottle arrives in presentation worthy of the occasion — weddings, Eid, or a quiet thank-you.",
    tip: "Add a handwritten note at checkout. We wrap each order by hand in Lahore."
  }
] as const;

export default function HomeRitualPanel() {
  const { progress } = useScrollExperience();
  const opacity = ritualPanelOpacity(progress);
  const local = sectionProgress(progress, "RITUAL");

  if (opacity <= 0.01) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity, visibility: opacity > 0.01 ? "visible" : "hidden" }}
    >
      <div className="flex h-full items-center px-6 md:px-12 lg:px-20">
        <div className="relative w-[30%] max-w-xs min-h-[15rem] md:max-w-sm">
          {RITUAL_STEPS.map((item, i) => {
            const visual = beatSlotVisual(local, i, RITUAL_BEAT_COUNT);
            const slotOp = visual.opacity * opacity;
            if (slotOp <= 0.005) return null;
            return (
              <div
                key={item.step}
                className="absolute inset-0 border border-white/10 bg-black/40 p-6 backdrop-blur-md md:p-8"
                style={{
                  opacity: slotOp,
                  transform: `translateX(${-visual.slide * 20}px)`
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37]/80">The ritual · {item.step}</p>
                <h3 className="mt-3 font-serif text-2xl text-white md:text-3xl">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">{item.body}</p>
              </div>
            );
          })}
        </div>

        <div className="w-[40%] shrink-0" aria-hidden />

        <div className="relative w-[30%] max-w-xs min-h-[15rem] md:max-w-sm">
          {RITUAL_STEPS.map((item, i) => {
            const visual = beatSlotVisual(local, i, RITUAL_BEAT_COUNT);
            const slotOp = visual.opacity * opacity;
            if (slotOp <= 0.005) return null;
            return (
              <div
                key={`${item.step}-tip`}
                className="absolute inset-0 flex flex-col justify-center border border-[#D4AF37]/20 bg-black/35 p-6 backdrop-blur-md md:p-8"
                style={{
                  opacity: slotOp,
                  transform: `translateX(${visual.slide * 20}px)`
                }}
              >
                <p className="text-[10px] uppercase tracking-[0.35em] text-white/40">Bukhari tip</p>
                <p className="mt-4 font-serif text-xl leading-relaxed text-[#D4AF37]/90 md:text-2xl">
                  &ldquo;{item.tip}&rdquo;
                </p>
                <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/30">Wear · Layer · Gift</p>
              </div>
            );
          })}
        </div>
      </div>
      <p className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.45em] text-white/35 md:bottom-16">
        How to wear Bukhari
      </p>
    </div>
  );
}
