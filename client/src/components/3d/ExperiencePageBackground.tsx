import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

/** Unified scroll experience backdrop — matches the story-screen mood. */
export default function ExperiencePageBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050403]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(160deg, rgba(212,175,55,0.14) 0%, rgba(5,4,3,0.88) 35%, rgba(5,4,3,0.95) 70%), url(${EXPERIENCE_TEXTURES.glassRoughness})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-[#D4AF37]/10" />
      <div className="pointer-events-none absolute inset-0 experience-grain opacity-30" />
    </div>
  );
}
