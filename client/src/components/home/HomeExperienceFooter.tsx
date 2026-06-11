import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { useAuthStore } from "../../store/authStore";

import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

import HomeFooterShowcase from "./HomeFooterShowcase";



const NAV_LINKS = [

  { to: "/", label: "Home" },

  { to: "/shop", label: "Shop" },

  { to: "/about", label: "About" },

  { to: "/blog", label: "Blog" },

  { to: "/contact", label: "Contact" }

];



export default function HomeExperienceFooter() {

  const { t } = useTranslation();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);



  return (

    <footer className="relative bg-[#050403] text-[#F5EDD6]">

      <div

        style={{

          backgroundImage: `linear-gradient(rgba(5,4,3,0.92), rgba(8,6,4,0.98)), url(${EXPERIENCE_TEXTURES.glassRoughness})`,

          backgroundSize: "cover",

          backgroundPosition: "center"

        }}

      >

        <HomeFooterShowcase />

      </div>



      <div

        className="border-t border-white/10 bg-[#080604]"

        style={{

          backgroundImage: `linear-gradient(rgba(8,6,4,0.95), rgba(8,6,4,0.98)), url(${EXPERIENCE_TEXTURES.glassRoughness})`,

          backgroundSize: "cover"

        }}

      >

        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-3 md:px-12">

          <div className="flex flex-col items-center text-center md:items-start md:text-left">

            <img

              src={EXPERIENCE_TEXTURES.brandIconWhite}

              alt="Bukhari Perfumes"

              className="h-14 w-14 object-contain"

            />

            <p className="mt-3 font-heading text-lg text-[#D4AF37]">Bukhari Perfumes</p>

            {isAuthenticated ? (

              <Link

                to="/profile"

                className="mt-4 text-sm text-white/70 underline-offset-4 hover:text-[#D4AF37] hover:underline"

              >

                My account

              </Link>

            ) : (

              <Link

                to="/login"

                className="mt-4 border border-[#D4AF37]/50 px-5 py-2 text-xs uppercase tracking-[0.2em] text-[#D4AF37] transition hover:bg-[#D4AF37] hover:text-black"

              >

                {t("nav.signIn")}

              </Link>

            )}

          </div>



          <div className="text-center md:text-left">

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Explore</p>

            <nav className="mt-4 flex flex-col gap-2">

              {NAV_LINKS.map((link) => (

                <Link

                  key={link.to}

                  to={link.to}

                  className="text-sm text-white/70 transition hover:text-[#D4AF37]"

                >

                  {link.label}

                </Link>

              ))}

            </nav>

          </div>



          <div className="text-center md:text-left">

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Contact</p>

            <div className="mt-4 space-y-2 text-sm text-white/70">

              <p>Lahore, Punjab, Pakistan</p>

              <p>

                <a href="mailto:hello@bukhariperfumes.com" className="hover:text-[#D4AF37]">

                  hello@bukhariperfumes.com

                </a>

              </p>

              <p>

                <a href="tel:+923001234567" className="hover:text-[#D4AF37]">

                  +92 300 123 4567

                </a>

              </p>

              <Link to="/contact" className="inline-block pt-2 text-[#D4AF37] hover:underline">

                Get in touch →

              </Link>

            </div>

          </div>

        </div>

      </div>



      <div className="border-t border-white/10 bg-[#050403] py-5 text-center">

        <p className="text-xs text-white/40">

          © {new Date().getFullYear()} Bukhari Perfumes. All rights reserved.

        </p>

      </div>

    </footer>

  );

}


