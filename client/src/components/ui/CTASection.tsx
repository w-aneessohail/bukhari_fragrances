import { Link } from "react-router-dom";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection } from "../../constants/scrollSections";

export default function CTASection() {
  const { progress } = useScrollExperience();
  const visible = isInSection(progress, "CTA");

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-20 flex items-center justify-center px-6 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="pointer-events-auto max-w-xl text-center">
        <svg className="mx-auto mb-8 h-6 w-48 text-[#D4AF37]" viewBox="0 0 200 12" fill="none">
          <path d="M0 6h80M120 6h80M90 0l10 6-10 6" stroke="currentColor" strokeWidth="0.5" />
        </svg>
        <h2
          className="font-serif text-[clamp(48px,8vw,96px)] leading-none text-[#D4AF37]"
          style={{ fontFamily: '"Cormorant Garamond", serif' }}
        >
          Discover Bukhari
        </h2>
        <p className="mt-4 font-sans text-lg text-[#F5EDD6]">
          A fragrance for every chapter of your story
        </p>
        <Link
          to="/shop"
          className="mt-10 inline-block bg-[#D4AF37] px-12 py-4 text-sm uppercase tracking-[0.2em] text-[#0A0804] transition hover:opacity-90"
        >
          Shop the Collection
        </Link>
        <div className="mt-6">
          <Link to="/about" className="text-sm text-[#F5EDD6] underline-offset-4 hover:underline">
            Our Heritage →
          </Link>
        </div>
        <form
          className="mt-10"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            type="email"
            placeholder="Enter your email for exclusive offers"
            className="w-full border-b border-[#D4AF37] bg-transparent py-3 text-center text-sm text-[#F5EDD6] placeholder:text-[#F5EDD6]/50 outline-none"
          />
        </form>
      </div>
    </div>
  );
}
