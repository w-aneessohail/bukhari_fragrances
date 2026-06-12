import { Link } from "react-router-dom";
import { m } from "./modernTheme";
import Reveal from "./Reveal";

const CHAPTERS = [
  {
    eyebrow: "Heritage",
    title: "Rooted in Lahore",
    body: "Generations of perfumery craft meet a modern house built for Pakistan's climate and occasions.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
    cta: { label: "Our story", to: "/about" }
  },
  {
    eyebrow: "Craft",
    title: "Notes chosen with intent",
    body: "Oud, rose, saffron, and amber — layered for depth without overwhelming the skin.",
    image: "https://images.unsplash.com/photo-1595425970387-43581757789b?auto=format&fit=crop&w=800&q=80",
    cta: { label: "Explore oud", to: "/shop?category=oud-attar" }
  },
  {
    eyebrow: "Ritual",
    title: "Wear it your way",
    body: "Pulse points for projection, fabric for longevity — discover how Lahore wears Bukhari.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    cta: { label: "Gift sets", to: "/gift-builder" }
  }
];

export default function ModernEditorialRail() {
  return (
    <section className={m.section}>
      <div className={m.sectionInner}>
        <Reveal>
          <p className={m.eyebrow}>The house</p>
          <h2 className={`${m.h2} max-w-xl`}>Story, craft, and ritual in one flowing edit.</h2>
        </Reveal>
      </div>

      <div className="modern-editorial-rail mt-10 flex gap-4 overflow-x-auto px-4 pb-4 md:px-6">
        {CHAPTERS.map((chapter, index) => (
          <Reveal
            key={chapter.title}
            delay={index * 0.08}
            className={`${m.card} w-[min(88vw,22rem)] shrink-0 snap-start overflow-hidden md:w-[24rem]`}
          >
            <div className="aspect-[4/3] overflow-hidden bg-bg-secondary">
              <img
                src={chapter.image}
                alt=""
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-6">
              <p className={`text-[10px] uppercase tracking-[0.32em] ${m.gold}`}>{chapter.eyebrow}</p>
              <h3 className={`mt-2 ${m.h3}`}>{chapter.title}</h3>
              <p className={`mt-3 ${m.body}`}>{chapter.body}</p>
              <Link to={chapter.cta.to} className={`mt-5 inline-block ${m.gold} text-sm font-medium hover:opacity-80`}>
                {chapter.cta.label} →
              </Link>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
