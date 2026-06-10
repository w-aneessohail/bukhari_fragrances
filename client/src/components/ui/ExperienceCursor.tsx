import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { getBottleState } from "../../utils/scrollChoreography";

export default function ExperienceCursor() {
  const { progress } = useScrollExperience();
  const bottle = getBottleState(progress);

  if (!bottle.interactive || bottle.opacity < 0.5) return null;

  return (
    <div className="pointer-events-none fixed bottom-10 left-1/2 z-30 -translate-x-1/2">
      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/5 backdrop-blur-sm">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/80">
          <path
            d="M5 3l14 9-6 1-2 7-6-17z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </svg>
      </div>
      <p className="mt-2 text-center text-[10px] uppercase tracking-[0.25em] text-white/40">
        Drag to explore
      </p>
    </div>
  );
}
