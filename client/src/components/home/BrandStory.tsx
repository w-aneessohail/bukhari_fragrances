import { Link } from "react-router-dom";

export default function BrandStory() {
  return (
    <section className="border-y border-border bg-bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-text-secondary">The house of Bukhari</p>
          <h2 className="mt-3 font-heading text-4xl text-accent-gold">Crafted in Lahore, worn worldwide</h2>
        </div>
        <div className="space-y-4 text-text-secondary">
          <p>
            Bukhari Perfumes brings together Eastern heritage and contemporary refinement. Each fragrance is composed
            with layered notes — from bright citrus openings to deep oud and amber bases.
          </p>
          <p>
            Whether you are building a daily signature or searching for a gift, our collection is curated for longevity,
            presence, and understated luxury.
          </p>
          <Link to="/about" className="inline-block text-accent-gold underline">
            Read our full story
          </Link>
        </div>
      </div>
    </section>
  );
}
