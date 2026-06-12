import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CartIcon, HeartIcon } from "../../icons/NavIcons";
import { useAuthStore } from "../../../store/authStore";
import { useCartDrawerStore } from "../../../store/cartDrawerStore";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import {
  ACTIVE_HOME_PATH,
  HOME_VARIANT_LABELS,
  isActiveHomePath,
  isExperienceHomePath,
  otherHomeRoutes
} from "../../../constants/homePages";
import SearchBar from "./SearchBar";
import ThemeToggle from "./ThemeToggle";
import UserMenu from "./UserMenu";

type NavbarProps = {
  isScrolled: boolean;
};

export default function Navbar({ isScrolled }: NavbarProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const onActiveHome = isActiveHomePath(pathname);
  const onExperienceScroll = isExperienceHomePath(pathname);
  const transparentTop = !isScrolled && !onExperienceScroll;

  const itemCount = useCartStore((state) => state.cart.itemCount);
  const openCartDrawer = useCartDrawerStore((state) => state.open);
  const badgePulse = useCartDrawerStore((state) => state.badgePulse);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wishlistCount = useWishlistStore((state) => state.items.length);

  const wishlistTarget = isAuthenticated ? "/wishlist" : "/login";

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all ${
        transparentTop
          ? "border-transparent bg-transparent"
          : "border-border bg-navbar/95 shadow-luxury backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link
          to={ACTIVE_HOME_PATH}
          className={`shrink-0 font-heading text-xl text-accent-gold sm:text-2xl ${
            onActiveHome ? "underline decoration-accent-gold/40 underline-offset-4" : ""
          }`}
          aria-current={onActiveHome ? "page" : undefined}
        >
          Bukhari Perfumes
        </Link>

        <nav className="hidden items-center gap-6 font-body text-sm text-text-secondary lg:flex">
          <Link
            to={ACTIVE_HOME_PATH}
            className={`transition hover:text-accent-gold ${onActiveHome ? "text-accent-gold" : ""}`}
            aria-current={onActiveHome ? "page" : undefined}
          >
            {t("nav.home")}
          </Link>
          {import.meta.env.DEV
            ? otherHomeRoutes().map(([variant, path]) => (
                <Link
                  key={variant}
                  to={path}
                  className="text-[10px] uppercase tracking-widest text-text-secondary/60 transition hover:text-accent-gold"
                  title={`Preview ${HOME_VARIANT_LABELS[variant]} homepage`}
                >
                  {HOME_VARIANT_LABELS[variant]}
                </Link>
              ))
            : null}
          <Link
            to="/shop"
            className={`transition hover:text-accent-gold ${pathname === "/shop" ? "text-accent-gold" : ""}`}
          >
            {t("nav.shop")}
          </Link>
          <Link to="/about" className="transition hover:text-accent-gold">
            {t("nav.about")}
          </Link>
          <Link to="/blog" className="transition hover:text-accent-gold">
            {t("nav.blog")}
          </Link>
          <Link to="/gift-builder" className="transition hover:text-accent-gold">
            {t("nav.gifts")}
          </Link>
          <Link to="/contact" className="transition hover:text-accent-gold">
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <SearchBar />
          <ThemeToggle />

          <Link
            to={wishlistTarget}
            className="relative rounded-full p-2 text-text-secondary transition hover:bg-card hover:text-accent-gold"
            aria-label="Wishlist"
          >
            <HeartIcon />
            {isAuthenticated && wishlistCount > 0 ? (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-gold px-1 text-[10px] font-semibold text-bg-primary">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={openCartDrawer}
            className="relative rounded-full p-2 text-text-secondary transition hover:bg-card hover:text-accent-gold"
            aria-label="Open cart"
          >
            <CartIcon />
            {itemCount > 0 ? (
              <motion.span
                animate={badgePulse ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-gold px-1 text-[10px] font-semibold text-bg-primary"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </motion.span>
            ) : null}
          </button>

          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-text-primary transition hover:border-accent-gold hover:text-accent-gold sm:px-4 sm:text-sm"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-accent-gold px-3 py-1.5 text-xs font-semibold text-bg-primary transition hover:opacity-90 sm:px-4 sm:text-sm"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
