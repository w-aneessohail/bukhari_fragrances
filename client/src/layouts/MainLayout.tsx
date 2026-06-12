import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import HomeExperienceFooter from "../components/home/HomeExperienceFooter";
import Navbar from "../components/layout/Navbar/Navbar";
import { isExperienceHomePath } from "../constants/homePages";
import ScrollProgress from "../components/layout/ScrollProgress";
import CartDrawer from "../components/cart/CartDrawer";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";

export default function MainLayout() {
  const { pathname } = useLocation();
  const hideFooter = isExperienceHomePath(pathname);
  const [isScrolled, setIsScrolled] = useState(false);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchWishlist = useWishlistStore((state) => state.fetchWishlist);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated, fetchWishlist]);

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <Navbar isScrolled={isScrolled} />
      <Outlet />
      {!hideFooter ? <HomeExperienceFooter /> : null}
      <CartDrawer />
    </div>
  );
}
