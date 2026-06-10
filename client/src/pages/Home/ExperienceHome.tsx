import { useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ScrollExperienceProvider } from "../../context/ScrollExperienceContext";
import { useLenis } from "../../hooks/useLenis";
import Scene from "../../components/3d/Scene";
import HomeScrollPanels from "../../components/home/HomeScrollPanels";
import HomeExperienceFooter from "../../components/home/HomeExperienceFooter";
import ExperienceCursor from "../../components/ui/ExperienceCursor";
import LoadingScreen from "../../components/ui/LoadingScreen";
import { EXPERIENCE_TEXTURES, PRELOAD_MODELS } from "../../constants/experienceAssets";

const SCROLL_HEIGHT_VH = 580;

PRELOAD_MODELS.forEach((url) => useGLTF.preload(url));

export default function ExperienceHome() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { progress, scrollY } = useLenis();
  const [isMobile, setIsMobile] = useState(false);
  const [lowPerformance, setLowPerformance] = useState(false);
  const [assetsReady, setAssetsReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

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
    }, 6000);

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

      <div
        ref={scrollRef}
        className="experience-home experience-grain relative bg-[#050403] text-[#F5EDD6]"
        style={{ height: `${SCROLL_HEIGHT_VH}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Suspense fallback={null}>
            <Scene onPerformanceChange={setLowPerformance} />
          </Suspense>

          <HomeScrollPanels />
          <ExperienceCursor />

          {import.meta.env.DEV ? (
            <div className="fixed bottom-4 left-4 z-[150] rounded bg-black/70 px-3 py-2 font-mono text-xs text-[#D4AF37]">
              scroll: {(progress * 100).toFixed(1)}%
            </div>
          ) : null}
        </div>
      </div>

      <HomeExperienceFooter />
    </ScrollExperienceProvider>
  );
}
