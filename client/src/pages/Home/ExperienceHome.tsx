import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollExperienceProvider } from "../../context/ScrollExperienceContext";
import { useLenis } from "../../hooks/useLenis";
import Scene from "../../components/3d/Scene";
import ExperienceNavbar from "../../components/ui/Navbar";
import HeroText from "../../components/ui/HeroText";
import SectionText from "../../components/ui/SectionText";
import CTASection from "../../components/ui/CTASection";
import LoadingScreen from "../../components/ui/LoadingScreen";
import PageMeta from "../../components/seo/PageMeta";
import JsonLd from "../../components/seo/JsonLd";
import { buildOrganizationJsonLd } from "../../utils/jsonLd";
import CartDrawer from "../../components/cart/CartDrawer";
import { useCartStore } from "../../store/cartStore";
import { EXPERIENCE_TEXTURES, PRELOAD_MODELS } from "../../constants/experienceAssets";

const SCROLL_HEIGHT_VH = 600;

PRELOAD_MODELS.forEach((url) => useGLTF.preload(url));

function ExperienceContent() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { progress, scrollY } = useLenis();
  const [isMobile, setIsMobile] = useState(false);
  const [lowPerformance, setLowPerformance] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const textureUrls = [
      EXPERIENCE_TEXTURES.hdri,
      EXPERIENCE_TEXTURES.sandDiffuse,
      EXPERIENCE_TEXTURES.brandLabel,
      EXPERIENCE_TEXTURES.mistWhite
    ];

    const totalItems = PRELOAD_MODELS.length + textureUrls.length;
    let loadedItems = 0;

    const updateProgress = () => {
      loadedItems += 1;
      setLoadProgress(Math.min(1, loadedItems / totalItems));
      if (loadedItems >= totalItems) {
        setAssetsReady(true);
      }
    };

    const manager = THREE.DefaultLoadingManager;
    const previousOnLoad = manager.onLoad;
    const previousOnError = manager.onError;

    manager.onLoad = () => {
      previousOnLoad?.();
    };

    manager.onError = (url) => {
      previousOnError?.(url);
      updateProgress();
    };

    const textureLoader = new THREE.TextureLoader(manager);
    textureUrls.forEach((url) => {
      textureLoader.load(url, updateProgress, undefined, updateProgress);
    });

    const fallbackTimer = window.setTimeout(() => {
      setAssetsReady(true);
      setLoadProgress(1);
    }, 4500);

    return () => {
      window.clearTimeout(fallbackTimer);
      manager.onLoad = previousOnLoad;
      manager.onError = previousOnError;
    };
  }, []);

  const scrollState = {
    progress,
    scrollY,
    isMobile,
    lowPerformance
  };

  return (
    <ScrollExperienceProvider value={scrollState}>
      <LoadingScreen progress={loadProgress} visible={!assetsReady} />

      <div ref={scrollRef} className="experience-home relative bg-[#0A0804] text-[#F5EDD6]" style={{ height: `${SCROLL_HEIGHT_VH}vh` }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Suspense fallback={null}>
            <Scene onPerformanceChange={setLowPerformance} />
          </Suspense>

          <ExperienceNavbar />
          <HeroText scrollerRef={scrollRef} />
          <SectionText scrollerRef={scrollRef} />
          <CTASection />

          {import.meta.env.DEV ? (
            <div className="fixed bottom-4 left-4 z-[150] rounded bg-black/70 px-3 py-2 font-mono text-xs text-[#D4AF37]">
              scroll: {(progress * 100).toFixed(1)}%
            </div>
          ) : null}
        </div>
      </div>

      <CartDrawer />
    </ScrollExperienceProvider>
  );
}

export default function ExperienceHome() {
  return (
    <>
      <PageMeta
        title="Bukhari Perfumes — Born from the Desert"
        description="A cinematic journey through Arabian luxury fragrances. Discover oud, amber, and attar crafted by Bukhari Perfumes."
        path="/"
      />
      <JsonLd data={buildOrganizationJsonLd()} />
      <ExperienceContent />
    </>
  );
}
