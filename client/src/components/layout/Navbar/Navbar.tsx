import { Link } from "react-router-dom";
import { ThemeMode } from "../../../enums/ThemeMode";
import { useAuthStore } from "../../../store/authStore";
import { useCartStore } from "../../../store/cartStore";
import { useWishlistStore } from "../../../store/wishlistStore";
import { useThemeStore } from "../../../store/themeStore";
import SearchBar from "./SearchBar";

type NavbarProps = {
  isScrolled: boolean;
};

export default function Navbar({ isScrolled }: NavbarProps) {
  const { theme, setTheme } = useThemeStore();
  const itemCount = useCartStore((state) => state.cart.itemCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

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
          <Link to="/gift-builder">Gifts</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <SearchBar />

          <Link to="/cart" className="relative text-sm text-text-secondary hover:text-accent-gold">
            Cart
            {itemCount > 0 ? (
              <span className="absolute -right-3 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent-gold px-1 text-xs font-semibold text-bg-primary">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            ) : null}
          </Link>

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
