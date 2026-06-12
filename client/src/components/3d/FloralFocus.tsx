import { useFrame } from "@react-three/fiber";
import { useCallback, useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { EXPERIENCE_MODELS } from "../../constants/experienceAssets";
import { SECTIONS } from "../../constants/scrollSections";
import { getFloralState } from "../../utils/scrollChoreography";
import SafeGlb, { PlaceholderFloral } from "./SafeGlb";

const PETAL_SPIN_SPEED = 0.08;
const LEAF_BASE_Y = 0.35;
const PETAL_BASE_Y = 0.35;

type MaterialSnapshot = { mat: THREE.Material; opacity: number; transparent: boolean };

function FocalModel({
  url,
  targetHeight,
  opacity,
  fallbackColor,
  rotation = [0, 0, 0],
  onMaterialsReady
}: {
  url: string;
  targetHeight: number;
  opacity: number;
  fallbackColor: string;
  rotation?: [number, number, number];
  onMaterialsReady?: (snapshots: MaterialSnapshot[]) => void;
}) {
  const snapshotsRef = useRef<MaterialSnapshot[]>([]);

  const handleReady = useCallback(
    (object: THREE.Object3D) => {
      const snapshots: MaterialSnapshot[] = [];
      object.traverse((child) => {
        if (!(child instanceof THREE.Mesh) || !child.material) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          snapshots.push({ mat, opacity: mat.opacity, transparent: mat.transparent });
          if ("envMapIntensity" in mat) {
            (mat as THREE.MeshStandardMaterial).envMapIntensity = 1.1;
          }
        });
      });
      snapshotsRef.current = snapshots;
      onMaterialsReady?.(snapshots);
    },
    [onMaterialsReady]
  );

  useFrame(() => {
    const targetOpacity = opacity;
    snapshotsRef.current.forEach(({ mat, opacity: baseOp, transparent }) => {
      if (targetOpacity < 0.999) {
        mat.transparent = true;
        mat.opacity = targetOpacity * baseOp;
      } else {
        mat.opacity = baseOp;
        mat.transparent = transparent;
      }
    });
  });

  if (opacity <= 0.02) return null;

  return (
    <SafeGlb
      url={url}
      targetHeight={targetHeight}
      rotation={rotation}
      fallback={<PlaceholderFloral color={fallbackColor} />}
      onReady={handleReady}
    />
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
    const time = state.clock.elapsedTime;

    if (popularRef.current) {
      popularRef.current.position.set(0, floral.pinkFlowerY, 0.35);
      popularRef.current.scale.setScalar(floral.pinkFlowerScale);
      popularRef.current.rotation.y = PETAL_BASE_Y + time * PETAL_SPIN_SPEED;
      popularRef.current.visible = floral.pinkFlowerOpacity > 0.02;
    }

    if (leafRef.current) {
      leafRef.current.position.set(0, floral.leafY, 0.35);
      leafRef.current.scale.setScalar(floral.leafScale);
      leafRef.current.rotation.y = LEAF_BASE_Y;
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
      <group ref={popularRef}>
        <pointLight ref={popularGlowRef} color="#8ec49a" distance={7} decay={2} />
        <FocalModel
          url={EXPERIENCE_MODELS.rosePetal}
          targetHeight={1.2}
          opacity={floral.pinkFlowerOpacity}
          fallbackColor="#4a7c59"
        />
      </group>
      <group ref={leafRef}>
        <pointLight ref={leafGlowRef} color="#c45a50" distance={7} decay={2} />
        <FocalModel
          url={EXPERIENCE_MODELS.redLeaf}
          targetHeight={1.4}
          opacity={floral.leafOpacity}
          fallbackColor="#8b3a3a"
        />
      </group>
    </group>
  );
}
