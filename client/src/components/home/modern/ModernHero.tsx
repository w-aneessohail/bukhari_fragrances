import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import BrandWordmark from "../../brand/BrandWordmark";
import BrandIconBrown from "../../brand/BrandIconBrown";
import { EXPERIENCE_TEXTURES } from "../../../constants/experienceAssets";
import { heroTagline } from "../../../utils/animations";

export default function ModernHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="modern-hero relative h-[calc(100svh-4.25rem)] max-h-[calc(100svh-4.25rem)] overflow-hidden border-b border-border">
      <div className="relative mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-5 px-4 py-5 md:grid-cols-2 md:gap-8 md:px-6 md:py-6 lg:gap-12">
        <div className="order-2 min-h-0 md:order-1">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="mb-4 flex items-center gap-3 md:mb-5"
          >
            <BrandIconBrown size="md" />
            <p className="text-[11px] uppercase tracking-[0.42em] text-text-secondary">Lahore · Pakistan</p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandWordmark size="hero" />
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary md:mt-5 md:text-base lg:text-lg"
          >
            {heroTagline}. Oud, attar, and modern parfums — curated like an editorial, shoppable like a
            boutique.
          </motion.p>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-6 flex flex-wrap gap-3 md:mt-7"
          >
            <Link
              to="/shop"
              className="rounded-full bg-accent-gold px-6 py-2.5 text-sm font-semibold text-bg-primary transition hover:opacity-90 md:px-7 md:py-3"
            >
              Shop collection
            </Link>
            <Link
              to="#scent-finder"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-text-primary transition hover:border-accent-gold hover:text-accent-gold md:px-7 md:py-3"
            >
              Find your scent
            </Link>
          </motion.div>

          <motion.dl
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 md:mt-7 md:gap-4 md:pt-6"
          >
            {[
              { label: "Scents", value: "50+" },
              { label: "Rating", value: "4.9★" },
              { label: "Cities", value: "40+" }
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-[10px] uppercase tracking-[0.28em] text-text-secondary">{stat.label}</dt>
                <dd className="mt-1 font-brand text-xl text-accent-gold md:text-2xl">{stat.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="order-1 flex min-h-0 items-center justify-center md:order-2"
        >
          <div className="modern-bottle-stage relative mx-auto flex h-[min(46vh,22rem)] w-full max-w-lg items-end justify-center sm:h-[min(50vh,24rem)] md:h-[min(58vh,30rem)] md:max-w-xl lg:h-[min(62vh,34rem)]">
            <div className="modern-bottle-glow pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2" aria-hidden />
            <div className="modern-bottle-ring pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2" aria-hidden />
            <div className="modern-bottle-mist pointer-events-none absolute bottom-[8%] left-1/2 h-24 w-[70%] -translate-x-1/2" aria-hidden />
            <div className="modern-bottle-floor pointer-events-none absolute bottom-[2%] left-1/2 h-8 w-[55%] -translate-x-1/2" aria-hidden />
            <BrandIconBrown
              size="md"
              className="pointer-events-none absolute right-[6%] top-[8%] z-20 opacity-90 md:right-[10%] md:top-[6%]"
            />
            <img
              src={EXPERIENCE_TEXTURES.heroBottle}
              alt="Bukhari Perfumes signature bottle"
              className="modern-hero-bottle relative z-10 h-[94%] w-auto max-w-full object-contain object-bottom drop-shadow-[0_32px_64px_rgba(0,0,0,0.65)]"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
