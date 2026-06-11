import { useScrollExperience } from "../../context/ScrollExperienceContext";

import { storyPanelOpacity } from "../../constants/scrollSections";

import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";



export default function HomeStoryPanel() {

  const { progress } = useScrollExperience();

  const opacity = storyPanelOpacity(progress);



  if (opacity <= 0.01) return null;



  return (

    <div

      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center transition-opacity duration-500"

      style={{ opacity }}

    >

      <div

        className="absolute inset-0"

        style={{

          backgroundImage: `linear-gradient(160deg, rgba(212,175,55,0.14) 0%, rgba(5,4,3,0.88) 35%, rgba(5,4,3,0.95) 70%), url(${EXPERIENCE_TEXTURES.glassRoughness})`,

          backgroundSize: "cover",

          backgroundPosition: "center"

        }}

      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] via-transparent to-[#D4AF37]/10 backdrop-blur-md" />

      <div className="pointer-events-none absolute inset-0 experience-grain opacity-30" />



      <div className="relative z-10 px-8 text-center md:px-16">

        <p className="text-sm uppercase tracking-[0.5em] text-[#D4AF37] md:text-base">Bukhari Perfumes</p>

        <h2 className="mt-8 font-serif text-5xl leading-[1.05] text-white md:text-7xl lg:text-8xl">

          Where every scent

          <br />

          tells a story

        </h2>

        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl lg:text-2xl">

          Handcrafted fragrances from Lahore — oud, rose attar, and signature collections for those who wear grace.

        </p>

      </div>

    </div>

  );

}


