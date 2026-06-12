import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useState } from "react";
import { Vector2 } from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { getCanvasOpacity } from "../../utils/scrollChoreography";
import EnvironmentSetup from "./EnvironmentSetup";
import CameraRig from "./CameraRig";
import ScrollHeroBottle from "./ScrollHeroBottle";
import FloralFocus from "./FloralFocus";
import ScentStream from "./ScentStream";

function SceneContent() {
  return (
    <group>
      <CameraRig />
      <EnvironmentSetup />
      <ScrollHeroBottle />
      <ScentStream />
      <FloralFocus />
    </group>
  );
}

type SceneProps = {
  onPerformanceChange?: (low: boolean) => void;
  onReady?: () => void;
};

export default function Scene({ onPerformanceChange, onReady }: SceneProps) {
  const { isMobile, lowPerformance, progress } = useScrollExperience();
  const [dpr, setDpr] = useState(() => (isMobile ? 1 : 1.25));
  const canvasOpacity = getCanvasOpacity(progress);
  const reduceEffects = isMobile || lowPerformance;

  const chromaticOffset = useMemo(
    () => (reduceEffects ? new Vector2(0, 0) : new Vector2(0.0005, 0.0005)),
    [reduceEffects]
  );

  return (
    <div className="absolute inset-0 z-0 transition-opacity duration-700" style={{ opacity: canvasOpacity }}>
      <Canvas
        shadows={!reduceEffects}
        dpr={dpr}
        camera={{ fov: 32, near: 0.1, far: 100, position: [-2.55, 0.32, 6.1] }}
        gl={{
          antialias: !reduceEffects,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false
        }}
        style={{ position: "absolute", inset: 0 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          onReady?.();
        }}
      >
        <PerformanceMonitor
          onDecline={() => {
            setDpr(1);
            onPerformanceChange?.(true);
          }}
          onIncline={() => {
            setDpr(isMobile ? 1 : 1.25);
            onPerformanceChange?.(false);
          }}
        />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
        <EffectComposer multisampling={reduceEffects ? 0 : 4}>
          <Bloom
            luminanceThreshold={0.58}
            intensity={reduceEffects ? 0.35 : 0.55}
            mipmapBlur
            radius={0.6}
          />
          <Vignette darkness={0.6} offset={0.3} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={chromaticOffset}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
