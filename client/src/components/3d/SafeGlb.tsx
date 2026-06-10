import { useGLTF } from "@react-three/drei";
import { Component, Suspense, useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";

type SafeGlbProps = {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  targetHeight?: number;
  fallback?: ReactNode;
  onReady?: (object: THREE.Object3D) => void;
};

class GlbErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function normalizeScale(
  object: THREE.Object3D,
  targetHeight: number,
  scale?: number | [number, number, number]
) {
  if (scale !== undefined) {
    if (typeof scale === "number") {
      object.scale.setScalar(scale);
    } else {
      object.scale.set(...scale);
    }
    return;
  }

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const height = Math.max(size.y, 0.001);
  const fit = targetHeight / height;
  object.scale.setScalar(fit);
}

function GlbModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale,
  targetHeight = 1.8,
  onReady
}: SafeGlbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    normalizeScale(clone, targetHeight, scale);
    return clone;
  }, [scene, scale, targetHeight]);

  useLayoutEffect(() => {
    onReady?.(model);
  }, [model, onReady]);

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={model} />
    </group>
  );
}

export function PlaceholderBottle({ glassColor = "#C8A96E" }: { glassColor?: string }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.55, 1.4, 0.55]} />
        <meshPhysicalMaterial
          color={glassColor}
          transmission={0.92}
          roughness={0.08}
          thickness={0.4}
          transparent
        />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 0.35, 24]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={1} roughness={0.15} />
      </mesh>
    </group>
  );
}

export function PlaceholderFloral({ color = "#8B2252" }: { color?: string }) {
  return (
    <mesh castShadow>
      <icosahedronGeometry args={[0.35, 1]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
    </mesh>
  );
}

export default function SafeGlb({
  url,
  fallback = null,
  ...props
}: SafeGlbProps) {
  return (
    <GlbErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <GlbModel url={url} fallback={fallback} {...props} />
      </Suspense>
    </GlbErrorBoundary>
  );
}
