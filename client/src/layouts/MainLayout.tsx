import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer/Footer";
import Navbar from "../components/layout/Navbar/Navbar";
import { useCartStore } from "../store/cartStore";

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar isScrolled={isScrolled} />
      <Outlet />
      <Footer />
    </div>
  );
}
