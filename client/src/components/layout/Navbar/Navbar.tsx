import { Link } from "react-router-dom";
import { ThemeMode } from "../../../enums/ThemeMode";
import { useThemeStore } from "../../../store/themeStore";

type NavbarProps = {
  isScrolled: boolean;
};

export default function Navbar({ isScrolled }: NavbarProps) {
  const { theme, setTheme } = useThemeStore();

  return (
    <header
      className={`sticky top-0 z-40 border-b border-border transition-all ${
        isScrolled ? "bg-navbar/95 backdrop-blur-md shadow-luxury" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-heading text-2xl text-accent-gold">
          Bukhari Perfumes
        </Link>

        <nav className="hidden items-center gap-6 font-body text-sm text-text-secondary md:flex">
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {Object.values(ThemeMode).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setTheme(mode)}
              className={`rounded px-2 py-1 text-xs capitalize ${
                theme === mode ? "bg-accent-gold text-bg-primary" : "text-text-secondary"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
