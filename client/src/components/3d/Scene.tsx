import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useState } from "react";
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
  const { isMobile, progress } = useScrollExperience();
  const [dpr, setDpr] = useState(1.5);
  const canvasOpacity = getCanvasOpacity(progress);

  return (
    <div className="absolute inset-0 z-0 transition-opacity duration-700" style={{ opacity: canvasOpacity }}>
      <Canvas
        shadows
        dpr={dpr}
        camera={{ fov: 32, near: 0.1, far: 100, position: [-2.55, 0.32, 6.1] }}
        gl={{
          antialias: true,
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
            setDpr(isMobile ? 1 : 1.5);
            onPerformanceChange?.(false);
          }}
        />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
        <EffectComposer>
          <Bloom luminanceThreshold={0.55} intensity={0.65} mipmapBlur radius={0.7} />
          <Vignette darkness={0.65} offset={0.3} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={isMobile ? new Vector2(0, 0) : new Vector2(0.0006, 0.0006)}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
