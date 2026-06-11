import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { EXPERIENCE_MODELS } from "../../constants/experienceAssets";
import { SECTIONS } from "../../constants/scrollSections";
import { getFloralState } from "../../utils/scrollChoreography";
import SafeGlb, { PlaceholderFloral } from "./SafeGlb";

/** Red leaf standing upright — tips at top and bottom. */
const RED_LEAF_ROTATION: [number, number, number] = [0, 0, 0];

function FocalModel({
  url,
  targetHeight,
  opacity,
  fallbackColor,
  rotation = [0, 0, 0]
}: {
  url: string;
  targetHeight: number;
  opacity: number;
  fallbackColor: string;
  rotation?: [number, number, number];
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
    <group ref={groupRef}>
      <SafeGlb
        url={url}
        targetHeight={targetHeight}
        rotation={rotation}
        fallback={<PlaceholderFloral color={fallbackColor} />}
      />
    </group>
  );
}

export default function FloralFocus() {
  const popularRef = useRef<THREE.Group>(null);
  const leafRef = useRef<THREE.Group>(null);
  const popularGlowRef = useRef<THREE.PointLight>(null);
  const leafGlowRef = useRef<THREE.PointLight>(null);
  const { progress } = useScrollExperience();

  useFrame((state) => {
    const floral = getFloralState(progress, state.clock.elapsedTime);

    if (popularRef.current) {
      popularRef.current.position.set(0, floral.pinkFlowerY, 0.35);
      popularRef.current.scale.setScalar(floral.pinkFlowerScale);
      popularRef.current.rotation.y = state.clock.elapsedTime * 0.08;
      popularRef.current.visible = floral.pinkFlowerOpacity > 0.02;
    }

    if (leafRef.current) {
      leafRef.current.position.set(0, floral.leafY, 0.35);
      leafRef.current.scale.setScalar(floral.leafScale);
      leafRef.current.rotation.set(...RED_LEAF_ROTATION);
      leafRef.current.visible = floral.leafOpacity > 0.02;
    }

    if (popularGlowRef.current) {
      popularGlowRef.current.intensity = floral.pinkFlowerOpacity * 3.2;
    }
    if (leafGlowRef.current) {
      leafGlowRef.current.intensity = floral.leafOpacity * 2.5;
    }
  });

  const floral = getFloralState(progress);
  if (progress < SECTIONS.POPULAR.start || progress >= SECTIONS.STORY.start) return null;

  return (
    <group>
      {/* Screen 3 — rose petal focal (original) */}
      <group ref={popularRef}>
        <pointLight ref={popularGlowRef} color="#8ec49a" distance={7} decay={2} />
        <FocalModel
          url={EXPERIENCE_MODELS.rosePetal}
          targetHeight={1.2}
          opacity={floral.pinkFlowerOpacity}
          fallbackColor="#4a7c59"
          rotation={[0, 0.35, 0]}
        />
      </group>
      {/* Screen 4 — red oak leaf focal, upright in center */}
      <group ref={leafRef}>
        <pointLight ref={leafGlowRef} color="#c45a50" distance={7} decay={2} />
        <FocalModel
          url={EXPERIENCE_MODELS.redLeaf}
          targetHeight={1.4}
          opacity={floral.leafOpacity}
          fallbackColor="#8b3a3a"
          rotation={RED_LEAF_ROTATION}
        />
      </group>
    </group>
  );
}
