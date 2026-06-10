import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { SECTIONS, type SectionKey } from "../../constants/scrollSections";

gsap.registerPlugin(ScrollTrigger);

type PanelConfig = {
  section: SectionKey;
  position: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  body?: string;
};

const PANELS: PanelConfig[] = [
  {
    section: "ORIGIN",
    position: "left-[8%] top-1/2 -translate-y-1/2 max-w-md",
    heading: "Every Ingredient",
    subheading: "Has a Story",
    body: "From the ancient Agarwood forests to the sun-baked amber plains, Bukhari sources only what nature has perfected over centuries."
  },
  {
    section: "CRAFT",
    position: "right-[8%] top-1/2 -translate-y-1/2 max-w-md text-right",
    heading: "72 Hours.",
    subheading: "Never Rushed.",
    body: "Each bottle is crafted through a process unchanged for four generations. Patience is not a virtue here — it is an ingredient."
  },
  {
    section: "COLLECTION",
    position: "left-1/2 top-[12%] -translate-x-1/2 max-w-lg text-center",
    heading: "The Collection",
    body: "Four expressions of the Arabian soul."
  },
  {
    section: "EXPERIENCE",
    position: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-2xl text-center",
    heading: "One Spray.",
    subheading: "A Thousand Memories."
  }
];

function SectionPanel({ panel, scrollerRef }: { panel: PanelConfig; scrollerRef: React.RefObject<HTMLElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { progress } = useScrollExperience();
  const { start, end } = SECTIONS[panel.section];
  const visible = progress >= start && progress < end;

  useEffect(() => {
    const el = ref.current;
    const scroller = scrollerRef.current;
    if (!el || !scroller) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-line]"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: scroller,
            scroller,
            start: `${start * 100}% top`,
            end: `${(start + 0.05) * 100}% top`,
            toggleActions: "play none none reverse"
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [panel.section, scrollerRef, start]);

  return (
    <div
      ref={ref}
      className={`pointer-events-none fixed z-20 px-6 transition-opacity duration-700 ${panel.position} ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {panel.eyebrow ? (
        <p data-line className="mb-3 text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
          {panel.eyebrow}
        </p>
      ) : null}
      <h2 data-line className="font-serif text-4xl text-[#F5EDD6] md:text-6xl">
        {panel.heading}
      </h2>
      {panel.subheading ? (
        <p data-line className="mt-2 font-serif text-2xl text-[#D4AF37] md:text-3xl">
          {panel.subheading}
        </p>
      ) : null}
      {panel.body ? (
        <p data-line className="mt-4 font-sans text-sm leading-relaxed text-[#E8DCC8] md:text-base">
          {panel.body}
        </p>
      ) : null}
    </div>
  );
}

export default function SectionText({ scrollerRef }: { scrollerRef: React.RefObject<HTMLElement | null> }) {
  return (
    <>
      {PANELS.map((panel) => (
        <SectionPanel key={panel.section} panel={panel} scrollerRef={scrollerRef} />
      ))}
    </>
  );
}
