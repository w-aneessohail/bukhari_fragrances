import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { EXPERIENCE_MODELS, EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";
import { getBottleState } from "../../utils/scrollChoreography";
import { applyBottleMaterials, createLabelPlane } from "./applyBottleMaterials";
import SafeGlb, { PlaceholderBottle } from "./SafeGlb";

function BottleModel({
  glassColor = "#d4c4a0",
  roughnessMap,
  labelMap,
  onReady
}: {
  glassColor?: string;
  roughnessMap?: THREE.Texture;
  labelMap?: THREE.Texture;
  onReady?: (object: THREE.Object3D) => void;
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
      if (!labelRef.current || labelAttached || !labelMap) {
        onReady?.(object);
        return;
      }
      labelRef.current.add(createLabelPlane(labelMap));
      setLabelAttached(true);
      onReady?.(object);
    },
    [glassColor, labelMap, labelAttached, onReady, roughnessMap]
  );

  return (
    <group>
      <group ref={labelRef} />
      <SafeGlb
        url={EXPERIENCE_MODELS.heroBottle}
        targetHeight={2.1}
        fallback={<PlaceholderBottle glassColor={glassColor} />}
        onReady={handleReady}
      />
    </group>
  );
}

function BottleWithTextures(props: { onReady?: (object: THREE.Object3D) => void }) {
  const textures = useTexture({
    roughness: EXPERIENCE_TEXTURES.glassRoughness,
    label: EXPERIENCE_TEXTURES.brandLabel
  });
  return <BottleModel roughnessMap={textures.roughness} labelMap={textures.label} {...props} />;
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

export default function ScrollHeroBottle() {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.PointLight>(null);
  const pointerRotation = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const { progress } = useScrollExperience();
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const { gl } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      const state = getBottleState(progressRef.current);
      if (!state.interactive) return;
      isDragging.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onUp = () => {
      isDragging.current = false;
    };

    const onMove = (event: PointerEvent) => {
      const state = getBottleState(progressRef.current);
      if (!state.interactive || state.opacity < 0.5) return;

      if (isDragging.current) {
        const dx = (event.clientX - lastPointer.current.x) / window.innerWidth;
        const dy = (event.clientY - lastPointer.current.y) / window.innerHeight;
        pointerRotation.current.y += dx * 4;
        pointerRotation.current.x += dy * 2;
        lastPointer.current = { x: event.clientX, y: event.clientY };
      } else {
        const nx = (event.clientX / window.innerWidth - 0.5) * 2;
        const ny = (event.clientY / window.innerHeight - 0.5) * 2;
        pointerRotation.current.y = THREE.MathUtils.lerp(pointerRotation.current.y, nx * 0.45, 0.04);
        pointerRotation.current.x = THREE.MathUtils.lerp(pointerRotation.current.x, ny * 0.1, 0.04);
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointerleave", onUp);
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointerleave", onUp);
      el.removeEventListener("pointermove", onMove);
    };
  }, [gl.domElement]);

  useFrame((state) => {
    const group = groupRef.current;
    const glow = glowRef.current;
    if (!group) return;

    const bottleState = getBottleState(progress, state.clock.elapsedTime);
    group.position.set(bottleState.position.x, bottleState.position.y, bottleState.position.z);
    group.scale.setScalar(bottleState.scale);
    group.visible = bottleState.opacity > 0.02;

    if (glow) {
      glow.intensity = bottleState.opacity * 2.5;
    }

    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          mat.transparent = true;
          mat.opacity = bottleState.opacity;
        });
      }
    });

    if (bottleState.interactive) {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, pointerRotation.current.y, 0.1);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, pointerRotation.current.x, 0.1);
      group.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.015;
    } else {
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, 0, 0.05);
      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, 0, 0.05);
    }
  });

  const fallback = <BottleModel glassColor="#d4c4a0" />;

  return (
    <group ref={groupRef}>
      <pointLight ref={glowRef} color="#f5e6c8" intensity={2.5} distance={5} decay={2} />
      <BottleTextureErrorBoundary fallback={fallback}>
        <Suspense fallback={fallback}>
          <BottleWithTextures />
        </Suspense>
      </BottleTextureErrorBoundary>
    </group>
  );
}
