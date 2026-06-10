import { Html } from "@react-three/drei";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type FloralTooltipProps = {
  position: [number, number, number];
  text: string;
};

export default function FloralTooltip({ position, text }: FloralTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [text]);

  return (
    <Html position={[position[0], position[1] + 1.2, position[2]]} center distanceFactor={10}>
      <div
        ref={ref}
        className="max-w-[220px] rounded border border-[#D4AF37] bg-[rgba(10,8,4,0.92)] px-5 py-4 font-serif text-[13px] leading-relaxed text-[#F5EDD6]"
      >
        {text}
      </div>
    </Html>
  );
}
