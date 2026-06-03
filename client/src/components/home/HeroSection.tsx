import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ParticleCanvas from "./ParticleCanvas";
import { heroTagline } from "../../utils/animations";

export default function HeroSection() {
  const bottleRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (bottleRef.current) {
      gsap.to(bottleRef.current, {
        y: -20,
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true
      });
    }

    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll("[data-char]");
      gsap.from(chars, {
        opacity: 0,
        y: 24,
        stagger: 0.04,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.2
      });
    }
  }, []);

  const title = "Bukhari Perfumes";

  return (
    <section className="hero-gradient relative flex min-h-screen items-center overflow-hidden border-b border-border">
      <ParticleCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(184,134,11,0.15),transparent_55%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-10 px-6 py-24 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-body text-sm uppercase tracking-[0.35em] text-text-secondary"
          >
            Lahore, Pakistan
          </motion.p>

          <h1
            ref={titleRef}
            className="mt-4 font-heading text-5xl leading-tight text-accent-gold md:text-7xl lg:text-8xl"
            aria-label={title}
          >
            {title.split("").map((char, index) => (
              <span key={`${char}-${index}`} data-char className="inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-6 max-w-xl font-body text-lg text-text-secondary md:text-xl"
          >
            {heroTagline} — oud, amber, florals, and attars curated for every occasion.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 flex flex-wrap justify-center gap-4 md:justify-start"
          >
            <Link
              to="/shop"
              className="rounded-lg bg-accent-gold px-8 py-3 font-medium text-bg-primary transition hover:opacity-90"
            >
              Explore collection
            </Link>
            <Link
              to="/#scent-finder"
              className="rounded-lg border border-border px-8 py-3 font-medium text-text-primary transition hover:border-accent-gold hover:text-accent-gold"
            >
              Find your scent
            </Link>
          </motion.div>
        </div>

        <div ref={bottleRef} className="mx-auto flex h-72 w-56 items-end justify-center md:h-[420px] md:w-72">
          <div className="relative h-full w-32 rounded-t-[999px] rounded-b-3xl border border-accent-gold/40 bg-gradient-to-b from-accent-gold/20 via-bg-secondary to-bg-primary shadow-luxury md:w-40">
            <div className="absolute left-1/2 top-8 h-16 w-16 -translate-x-1/2 rounded-full border border-accent-gold/30 bg-accent-gold/10" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
              <p className="font-heading text-sm text-accent-gold">Bukhari</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text-secondary"
        aria-hidden
      >
        ↓
      </motion.div>
    </section>
  );
}
