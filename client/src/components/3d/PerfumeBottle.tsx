import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useCallback, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection, sectionProgress } from "../../constants/scrollSections";
import { EXPERIENCE_MODELS, EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";
import { applyBottleMaterials, createLabelPlane } from "./applyBottleMaterials";
import SafeGlb, { PlaceholderBottle } from "./SafeGlb";

type PerfumeBottleProps = {
  position?: [number, number, number];
  glassColor?: string;
  visible?: boolean;
  modelPath?: string;
  targetHeight?: number;
};

function BottleModel({
  position = [0, 0, 0],
  glassColor = "#C8A96E",
  modelPath = EXPERIENCE_MODELS.heroBottle,
  targetHeight = 1.85,
  roughnessMap,
  labelMap
}: PerfumeBottleProps & {
  roughnessMap?: THREE.Texture;
  labelMap?: THREE.Texture;
}) {
  const labelRef = useRef<THREE.Group>(null);
  const [labelAttached, setLabelAttached] = useState(false);

  const handleReady = useCallback(
    (object: THREE.Object3D) => {
      applyBottleMaterials(object, {
        glassColor,
        roughnessMap: roughnessMap ?? null,
        labelMap: labelMap ?? null
      });

      if (!labelRef.current || labelAttached || !labelMap) return;
      labelRef.current.add(createLabelPlane(labelMap));
      setLabelAttached(true);
    },
    [glassColor, labelMap, labelAttached, roughnessMap]
  );

  return (
    <group position={position}>
      <group ref={labelRef} />
      <SafeGlb
        url={modelPath}
        targetHeight={targetHeight}
        fallback={<PlaceholderBottle glassColor={glassColor} />}
        onReady={handleReady}
      />
    </group>
  );
}

function BottleWithTextures(props: PerfumeBottleProps) {
  const textures = useTexture({
    roughness: EXPERIENCE_TEXTURES.glassRoughness,
    label: EXPERIENCE_TEXTURES.brandLabel
  });

  return (
    <BottleModel
      {...props}
      roughnessMap={textures.roughness}
      labelMap={textures.label}
    />
  );
}

class BottleTextureErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function PerfumeBottle({
  position = [0, 0, 0],
  glassColor = "#C8A96E",
  visible = true,
  modelPath = EXPERIENCE_MODELS.heroBottle,
  targetHeight = 1.85
}: PerfumeBottleProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { progress } = useScrollExperience();

  useFrame((_, delta) => {
    if (!groupRef.current || !visible) return;

    const hero = sectionProgress(progress, "HERO");
    const inCta = isInSection(progress, "CTA");

    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      position[1] + hero * 0.2,
      0.1
    );

    if (inCta) {
      groupRef.current.rotation.y += delta * 0.22;
    } else {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, hero * 0.25, 0.05);
    }
  });

  if (!visible) return null;

  const fallback = (
    <BottleModel
      position={[0, 0, 0]}
      glassColor={glassColor}
      modelPath={modelPath}
      targetHeight={targetHeight}
    />
  );

  return (
    <group ref={groupRef} position={position}>
      <BottleTextureErrorBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          <BottleWithTextures
            glassColor={glassColor}
            modelPath={modelPath}
            targetHeight={targetHeight}
          />
        </Suspense>
      </BottleTextureErrorBoundary>
    </group>
  );
}
