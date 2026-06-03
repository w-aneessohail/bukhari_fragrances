import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ingredientStops } from "../../utils/animations";

gsap.registerPlugin(ScrollTrigger);

export default function IngredientsJourney() {
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 40%",
          scrub: true
        }
      });

      gsap.utils.toArray<HTMLElement>(".ingredient-stop").forEach((stop) => {
        gsap.from(stop, {
          opacity: 0,
          scale: 0.8,
          duration: 0.5,
          scrollTrigger: {
            trigger: stop,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-border bg-bg-secondary py-20">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 className="font-heading text-4xl text-accent-gold">The ingredients</h2>
        <p className="mt-2 text-text-secondary">A journey across regions that shape our scent profiles.</p>

        <div className="relative mt-12 aspect-[16/9] rounded-2xl border border-border bg-card p-6">
          <svg viewBox="0 0 100 60" className="h-full w-full">
            <path
              ref={pathRef}
              d="M10 30 C25 10, 40 50, 55 28 S80 12, 90 30"
              fill="none"
              stroke="#B8860B"
              strokeWidth="0.6"
            />
            {ingredientStops.map((stop) => (
              <g key={stop.name}>
                <circle cx={stop.x} cy={stop.y} r="1.5" fill="#B8860B" />
              </g>
            ))}
          </svg>

          {ingredientStops.map((stop) => (
            <div
              key={stop.name}
              className="ingredient-stop absolute rounded-lg border border-border bg-bg-primary px-3 py-2 text-xs shadow-luxury"
              style={{ left: `${stop.x}%`, top: `${stop.y}%`, transform: "translate(-50%, -120%)" }}
            >
              <p className="font-medium text-accent-gold">{stop.name}</p>
              <p className="text-text-secondary">{stop.region}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
