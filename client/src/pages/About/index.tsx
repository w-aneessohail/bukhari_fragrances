import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">About us</p>
      <h1 className="mt-3 font-heading text-5xl text-accent-gold">Bukhari Perfumes</h1>
      <p className="mt-6 text-lg leading-relaxed text-text-secondary">
        Founded in Lahore, Bukhari Perfumes celebrates the art of fine fragrance. We blend traditional perfumery with
        modern composition — offering eau de parfum, attars, and gift-ready sets for men and women.
      </p>

      <div className="mt-12 space-y-8">
        <article>
          <h2 className="font-heading text-2xl text-text-primary">Our philosophy</h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            Quality begins with ingredients. We source rich oud accords, damask rose, amber, and fine musks, then balance
            them for wearability from morning to evening. Every bottle reflects patience, precision, and respect for the
            wearer.
          </p>
        </article>

        <article>
          <h2 className="font-heading text-2xl text-text-primary">What we offer</h2>
          <ul className="mt-3 list-inside list-disc space-y-2 text-text-secondary">
            <li>Signature perfumes for men, women, and unisex wear</li>
            <li>Multiple sizes with transparent pricing in PKR</li>
            <li>Cash on delivery and secure checkout across Pakistan</li>
            <li>Curated gift sets and seasonal collections</li>
          </ul>
        </article>

        <article>
          <h2 className="font-heading text-2xl text-text-primary">Visit us</h2>
          <p className="mt-3 leading-relaxed text-text-secondary">
            Experience our fragrances online or reach out for personalised recommendations. We are proud to serve
            customers who value scent as an expression of identity.
          </p>
        </article>
      </div>

      <Link
        to="/shop"
        className="mt-12 inline-block rounded-lg bg-accent-gold px-8 py-3 font-medium text-bg-primary"
      >
        Explore the shop
      </Link>
    </section>
  );
}
