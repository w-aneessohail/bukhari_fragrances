import { useEffect, useState } from "react";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

type LoadingScreenProps = {
  progress: number;
  visible: boolean;
};

export default function LoadingScreen({ progress, visible }: LoadingScreenProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!visible) {
      const timer = window.setTimeout(() => setHidden(true), 900);
      return () => window.clearTimeout(timer);
    }
    setHidden(false);
    return undefined;
  }, [visible]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-[#050403]"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(5,4,3,0.97) 0%, rgba(8,6,4,1) 50%, rgba(5,4,3,1) 100%), url(${EXPERIENCE_TEXTURES.glassRoughness})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#D4AF37]/8 via-transparent to-black/40" />
      <div className="pointer-events-none absolute inset-0 experience-grain opacity-25" />

      <div className="relative z-10 flex flex-col items-center px-8 text-center">
        <img
          src={EXPERIENCE_TEXTURES.brandIconWhite}
          alt="Bukhari Perfumes"
          className="h-24 w-24 object-contain opacity-90 md:h-32 md:w-32"
        />
        <p className="mt-8 font-heading text-3xl tracking-[0.2em] text-[#D4AF37] md:text-4xl">
          Bukhari Perfumes
        </p>
        <p className="mt-4 text-sm uppercase tracking-[0.4em] text-white/50 md:text-base">
          Lahore · Pakistan
        </p>
      </div>

      <div className="absolute bottom-12 left-1/2 w-48 -translate-x-1/2">
        <div className="h-px bg-[#D4AF37]/20">
          <div
            className="h-full bg-[#D4AF37] transition-all duration-300"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-white/35">
          Loading experience
        </p>
      </div>
    </div>
  );
}

