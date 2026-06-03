import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brandStats, storyChapters } from "../../utils/animations";

gsap.registerPlugin(ScrollTrigger);

function AnimatedStat({ value, suffix }: { value: number; suffix: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top 85%",
      once: true,
      onEnter: () => {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => setDisplay(Math.round(counter.val))
        });
      }
    });

    return () => trigger.kill();
  }, [value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export default function StorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".story-chapter").forEach((chapter) => {
        gsap.from(chapter.querySelector(".story-copy"), {
          x: -60,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: chapter,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });

        gsap.from(chapter.querySelector(".story-image"), {
          y: 40,
          opacity: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: chapter,
            start: "top 75%",
            toggleActions: "play none none reverse"
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="border-y border-border bg-bg-secondary py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="text-sm uppercase tracking-[0.25em] text-text-secondary">Our story</p>
        <h2 className="mt-3 font-heading text-4xl text-accent-gold md:text-5xl">The Bukhari journey</h2>

        <div className="mt-16 space-y-24">
          {storyChapters.map((chapter, index) => (
            <article
              key={chapter.title}
              className={`story-chapter grid items-center gap-10 md:grid-cols-2 ${
                index % 2 === 1 ? "md:[&_.story-image]:order-first" : ""
              }`}
            >
              <div className="story-copy">
                <h3 className="font-heading text-3xl text-text-primary">{chapter.title}</h3>
                <p className="mt-4 text-text-secondary">{chapter.body}</p>
              </div>
              <div className="story-image overflow-hidden rounded-2xl border border-border">
                <img src={chapter.image} alt={chapter.title} className="h-72 w-full object-cover md:h-96" loading="lazy" />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-6 sm:grid-cols-3">
          {brandStats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-border bg-card p-6 text-center">
              <p className="text-3xl font-semibold text-accent-gold">
                <AnimatedStat value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
