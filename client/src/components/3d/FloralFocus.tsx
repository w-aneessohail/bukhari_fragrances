import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { EXPERIENCE_MODELS } from "../../constants/experienceAssets";
import { SECTIONS } from "../../constants/scrollSections";
import { getFloralState } from "../../utils/scrollChoreography";
import SafeGlb, { PlaceholderFloral } from "./SafeGlb";

function FocalModel({
  url,
  targetHeight,
  opacity,
  fallbackColor,
  rotationY = 0
}: {
  url: string;
  targetHeight: number;
  opacity: number;
  fallbackColor: string;
  rotationY?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    group.visible = opacity > 0.02;
    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = opacity;
        });
      }
    });
  });

  if (opacity <= 0.02) return null;

  return (
    <group ref={groupRef} rotation={[0, rotationY, 0]}>
      <SafeGlb
        url={url}
        targetHeight={targetHeight}
        fallback={<PlaceholderFloral color={fallbackColor} />}
      />
    </group>
  );
}

export default function FloralFocus() {
  const pinkRef = useRef<THREE.Group>(null);
  const leafRef = useRef<THREE.Group>(null);
  const pinkGlowRef = useRef<THREE.PointLight>(null);
  const leafGlowRef = useRef<THREE.PointLight>(null);
  const { progress } = useScrollExperience();

  useFrame((state) => {
    const floral = getFloralState(progress, state.clock.elapsedTime);

    if (pinkRef.current) {
      pinkRef.current.position.y = floral.pinkFlowerY;
      pinkRef.current.scale.setScalar(floral.pinkFlowerScale);
      pinkRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      pinkRef.current.visible = floral.pinkFlowerOpacity > 0.02;
    }

    if (leafRef.current) {
      leafRef.current.position.y = floral.leafY;
      leafRef.current.scale.setScalar(floral.leafScale);
      leafRef.current.rotation.y = state.clock.elapsedTime * 0.12;
      leafRef.current.visible = floral.leafOpacity > 0.02;
    }

    if (pinkGlowRef.current) {
      pinkGlowRef.current.intensity = floral.pinkFlowerOpacity * 3.2;
    }
    if (leafGlowRef.current) {
      leafGlowRef.current.intensity = floral.leafOpacity * 2.5;
    }
  });

  const floral = getFloralState(progress);
  if (progress < SECTIONS.POPULAR.start || progress >= SECTIONS.OUTRO.start) return null;

  return (
    <group>
      {/* Screen 3 — rose petal focal */}
      <group ref={pinkRef}>
        <pointLight ref={pinkGlowRef} color="#8ec49a" distance={7} decay={2} />
        <FocalModel
          url={EXPERIENCE_MODELS.rosePetal}
          targetHeight={1.2}
          opacity={floral.pinkFlowerOpacity}
          fallbackColor="#4a7c59"
          rotationY={0.35}
        />
      </group>
      {/* Screen 4 — pink rose focal */}
      <group ref={leafRef}>
        <pointLight ref={leafGlowRef} color="#f0a0b8" distance={7} decay={2} />
        <FocalModel
          url={EXPERIENCE_MODELS.pinkFlower}
          targetHeight={1.45}
          opacity={floral.leafOpacity}
          fallbackColor="#e8a0b8"
        />
      </group>
    </group>
  );
}
