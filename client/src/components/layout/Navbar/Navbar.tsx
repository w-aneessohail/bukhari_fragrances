import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import { ThemeMode } from "../../../enums/ThemeMode";
import { logoutUser } from "../../../services/authService";
import { useAuthStore } from "../../../store/authStore";
import { useCartDrawerStore } from "../../../store/cartDrawerStore";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useThemeStore } from "../../../store/themeStore";
import SearchBar from "./SearchBar";

type NavbarProps = {
  isScrolled: boolean;
};

export default function Navbar({ isScrolled }: NavbarProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const itemCount = useCartStore((state) => state.cart.itemCount);
  const openCartDrawer = useCartDrawerStore((state) => state.open);
  const badgePulse = useCartDrawerStore((state) => state.badgePulse);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  const switchLanguage = (lang: "en" | "ur") => {
    void i18n.changeLanguage(lang);
    localStorage.setItem("bukhari-lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ur" ? "rtl" : "ltr";
  };

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
          <Link to="/shop">{t("nav.shop")}</Link>
          <Link to="/about">{t("nav.about")}</Link>
          <Link to="/blog">{t("nav.blog")}</Link>
          <Link to="/gift-builder">{t("nav.gifts")}</Link>
          <Link to="/contact">{t("nav.contact")}</Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 text-xs md:flex">
            <button
              type="button"
              onClick={() => switchLanguage("en")}
              className={`rounded px-2 py-1 ${i18n.language === "en" ? "bg-accent-gold text-bg-primary" : "text-text-secondary"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => switchLanguage("ur")}
              className={`rounded px-2 py-1 ${i18n.language === "ur" ? "bg-accent-gold text-bg-primary" : "text-text-secondary"}`}
            >
              UR
            </button>
          </div>
          <SearchBar />

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative text-sm text-text-secondary hover:text-accent-gold"
            aria-label="Open cart"
          >
            {t("nav.cart")}
            {itemCount > 0 ? (
              <motion.span
                animate={badgePulse ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-gold px-1 text-xs font-semibold text-bg-primary"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </motion.span>
            ) : null}
          </button>

          {isAdmin ? (
            <Link to="/admin" className="text-sm text-text-secondary hover:text-accent-gold">
              Admin
            </Link>
          ) : null}

          {isAuthenticated ? (
            <>
            <Link to="/profile" className="text-sm text-text-secondary hover:text-accent-gold">
              Account
            </Link>
            <Link to="/wishlist" className="relative text-sm text-text-secondary hover:text-accent-gold">
              Wishlist
              {wishlistCount > 0 ? (
                <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-gold px-1 text-xs font-semibold text-bg-primary">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-text-secondary hover:text-accent-gold"
            >
              Sign out
            </button>
            </>
          ) : (
            <Link to="/login" className="text-sm text-text-secondary hover:text-accent-gold">
              Sign in
            </Link>
          )}

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
