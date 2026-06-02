import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/layout/Footer/Footer";
import Navbar from "../components/layout/Navbar/Navbar";

export default function MainLayout() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar isScrolled={isScrolled} />
      <Outlet />
      <Footer />
    </div>
  );
}
