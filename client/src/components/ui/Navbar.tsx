import { Link } from "react-router-dom";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { SECTIONS } from "../../constants/scrollSections";

const LINKS = [
  { label: "Collection", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Heritage", to: "/about" },
  { label: "Contact", to: "/contact" }
];

export default function ExperienceNavbar() {
  const { progress } = useScrollExperience();
  const pastHero = progress > SECTIONS.HERO.end;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] flex items-center justify-between px-6 py-5 transition-all duration-500 md:px-10 ${
        pastHero ? "bg-[rgba(10,8,4,0.7)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <Link to="/" className="font-serif text-xl tracking-wide text-[#D4AF37] md:text-2xl">
        Bukhari
      </Link>
      <nav className="flex items-center gap-6 md:gap-8">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="text-xs uppercase tracking-[0.15em] text-[#F5EDD6] transition hover:text-[#D4AF37] hover:underline hover:underline-offset-4 md:text-sm"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
