import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeMode } from "../../enums/ThemeMode";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { ACTIVE_HOME_PATH } from "../../constants/homePages";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";
import HomeFooterShowcase from "./HomeFooterShowcase";

const NAV_LINKS = [
  { to: ACTIVE_HOME_PATH, label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" }
];

export default function HomeExperienceFooter() {
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isDark = useThemeStore((state) => state.theme) === ThemeMode.DARK;
  const brandIcon = isDark ? EXPERIENCE_TEXTURES.brandIconWhite : EXPERIENCE_TEXTURES.brandIconBrown;

  return (
    <footer className="relative border-t border-border bg-bg-primary text-text-primary">
      <div className={isDark ? "bg-bg-secondary/80" : "bg-bg-secondary/50"}>
        <HomeFooterShowcase />
      </div>

      <div className="border-t border-border bg-bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:px-12">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <img src={brandIcon} alt="Bukhari Perfumes" className="h-14 w-14 object-contain" />
            <p className="mt-3 font-heading text-lg text-accent-gold">Bukhari Perfumes</p>
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="mt-4 text-sm text-text-secondary underline-offset-4 hover:text-accent-gold hover:underline"
              >
                My account
              </Link>
            ) : (
              <Link
                to="/login"
                className="mt-4 border border-accent-gold/50 px-5 py-2 text-xs uppercase tracking-[0.2em] text-accent-gold transition hover:bg-accent-gold hover:text-bg-primary"
              >
                {t("nav.signIn")}
              </Link>
            )}
          </div>

          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">Explore</p>
            <nav className="mt-4 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-text-secondary transition hover:text-accent-gold"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="text-center md:text-left">
            <p className="text-[10px] uppercase tracking-[0.3em] text-text-secondary">Contact</p>
            <div className="mt-4 space-y-2 text-sm text-text-secondary">
              <p>Lahore, Punjab, Pakistan</p>
              <p>
                <a href="mailto:hello@bukhariperfumes.com" className="hover:text-accent-gold">
                  hello@bukhariperfumes.com
                </a>
              </p>
              <p>
                <a href="tel:+923001234567" className="hover:text-accent-gold">
                  +92 300 123 4567
                </a>
              </p>
              <Link to="/contact" className="inline-block pt-2 text-accent-gold hover:underline">
                Get in touch →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-bg-primary py-5 text-center">
        <p className="text-xs text-text-secondary">
          © {new Date().getFullYear()} Bukhari Perfumes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
