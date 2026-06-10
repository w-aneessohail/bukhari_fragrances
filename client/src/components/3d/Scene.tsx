import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useState } from "react";
import { Vector2 } from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import EnvironmentSetup from "./EnvironmentSetup";
import CameraRig from "./CameraRig";
import PerfumeBottle from "./PerfumeBottle";
import FloralCluster from "./FloralCluster";
import SmokeParticles from "./SmokeParticles";
import GoldDust from "./GoldDust";
import RosePetals from "./RosePetals";
import BottleCollection from "./BottleCollection";
import { isInSection } from "../../constants/scrollSections";

function SceneContent() {
  const { progress, isMobile, lowPerformance } = useScrollExperience();
  const showHeroBottle = !isInSection(progress, "COLLECTION") && progress < 0.68;

  return (
    <>
      <CameraRig />
      <EnvironmentSetup />
      <GoldDust />
      {showHeroBottle ? <PerfumeBottle /> : null}
      <FloralCluster />
      <SmokeParticles />
      <RosePetals />
      <BottleCollection />
    </>
  );
}

type SceneProps = {
  onPerformanceChange?: (low: boolean) => void;
};

export default function Scene({ onPerformanceChange }: SceneProps) {
  const { isMobile } = useScrollExperience();
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        shadows
        dpr={dpr}
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, -0.5, 4] }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: "absolute", inset: 0 }}
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
          <Bloom luminanceThreshold={0.8} intensity={0.4} mipmapBlur />
          <Vignette darkness={0.6} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={isMobile ? new Vector2(0, 0) : new Vector2(0.0005, 0.0005)}
            radialModulation={false}
            modulationOffset={0}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
