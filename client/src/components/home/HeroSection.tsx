import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-bg-secondary">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.12),transparent_55%)]" />
      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center justify-center px-6 py-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-body text-sm uppercase tracking-[0.35em] text-text-secondary"
        >
          Lahore, Pakistan
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-4xl font-heading text-5xl leading-tight text-accent-gold md:text-7xl"
        >
          Bukhari Perfumes
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl font-body text-lg text-text-secondary md:text-xl"
        >
          Refined fragrances for modern elegance — oud, amber, florals, and attars curated for every occasion.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/shop"
            className="rounded-lg bg-accent-gold px-8 py-3 font-medium text-bg-primary transition hover:opacity-90"
          >
            Shop collection
          </Link>
          <Link
            to="/about"
            className="rounded-lg border border-border px-8 py-3 font-medium text-text-primary transition hover:border-accent-gold hover:text-accent-gold"
          >
            Our story
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
