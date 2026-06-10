import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection } from "../../constants/scrollSections";

gsap.registerPlugin(ScrollTrigger);

export default function HeroText({ scrollerRef }: { scrollerRef: React.RefObject<HTMLElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progress } = useScrollExperience();
  const visible = isInSection(progress, "HERO");

  useEffect(() => {
    const el = containerRef.current;
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-hero-line]"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scroller,
            scroller,
            start: "top top",
            end: "15% top",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [scrollerRef]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-20 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <p data-hero-line className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
        EST. 1987 — ARABIAN LUXURY FRAGRANCES
      </p>
      <h1 data-hero-line className="font-serif text-5xl text-[#F5EDD6] md:text-7xl lg:text-8xl">
        Born from the Desert.
      </h1>
      <p data-hero-line className="mt-4 font-serif text-2xl text-[#D4AF37] md:text-4xl">
        Worn by the Worthy.
      </p>
      <div data-hero-line className="mt-16 flex flex-col items-center gap-2 text-[#F5EDD6]/70">
        <span className="text-xs uppercase tracking-[0.3em]">Scroll</span>
        <div className="h-10 w-px animate-pulse bg-[#D4AF37]" />
      </div>
    </div>
  );
}
