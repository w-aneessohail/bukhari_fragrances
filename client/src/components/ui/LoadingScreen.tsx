import { useEffect, useState } from "react";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

type LoadingScreenProps = {
  progress: number;
  visible: boolean;
};

export default function LoadingScreen({ progress, visible }: LoadingScreenProps) {
  const [hidden, setHidden] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  useEffect(() => {
    if (!visible) {
      const timer = window.setTimeout(() => setHidden(true), 800);
      return () => window.clearTimeout(timer);
    }
    setHidden(false);
    return undefined;
  }, [visible]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#0A0804] transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {!logoFailed ? (
        <img
          src={EXPERIENCE_TEXTURES.brandLabel}
          alt="Bukhari Perfumes"
          className="h-16 w-auto max-w-[280px] object-contain md:h-20"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        <>
          <p className="font-serif text-4xl tracking-[0.2em] text-[#D4AF37] md:text-5xl">Bukhari</p>
          <p className="mt-2 text-xs uppercase tracking-[0.4em] text-[#F5EDD6]/60">Perfumes</p>
        </>
      )}
      <div className="absolute bottom-12 left-1/2 h-px w-48 -translate-x-1/2 bg-[#D4AF37]/20">
        <div
          className="h-full bg-[#D4AF37] transition-all duration-300"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
