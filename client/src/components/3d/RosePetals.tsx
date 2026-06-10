import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection } from "../../constants/scrollSections";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

const COUNT = 60;

function PetalMesh({ alphaMap }: { alphaMap: THREE.Texture | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8B2252",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        roughness: 0.65,
        alphaMap: alphaMap ?? undefined,
        alphaTest: alphaMap ? 0.15 : 0,
        depthWrite: !alphaMap
      }),
    [alphaMap]
  );

  const reset = (mesh: THREE.Mesh) => {
    mesh.position.x = (Math.random() - 0.5) * 10;
    mesh.position.y = 8 + Math.random() * 4;
    mesh.position.z = (Math.random() - 0.5) * 6;
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  };

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.position.y -= delta * (0.3 + (seed % 0.2));
    mesh.position.x += Math.sin(state.clock.elapsedTime + seed) * delta * 0.1;
    mesh.rotation.x += delta * 0.5;
    mesh.rotation.z += delta * 0.3;

    if (mesh.position.y < -2) {
      reset(mesh);
    }
  });

  return (
    <mesh ref={meshRef} material={material} castShadow>
      <planeGeometry args={[0.18, 0.24]} />
    </mesh>
  );
}

function Petal({ alphaMap }: { alphaMap: THREE.Texture | null }) {
  return <PetalMesh alphaMap={alphaMap} />;
}

function PetalsWithTexture() {
  const alphaMap = useTexture(EXPERIENCE_TEXTURES.rosePetalAlpha);
  alphaMap.colorSpace = THREE.SRGBColorSpace;
  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <Petal key={i} alphaMap={alphaMap} />
      ))}
    </group>
  );
}

class PetalErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          {Array.from({ length: COUNT }, (_, i) => (
            <Petal key={i} alphaMap={null} />
          ))}
        </group>
      );
    }
    return this.props.children;
  }
}

export default function RosePetals() {
  const { progress } = useScrollExperience();

  if (!isInSection(progress, "COLLECTION")) return null;

  return (
    <PetalErrorBoundary>
      <Suspense
        fallback={
          <group>
            {Array.from({ length: COUNT }, (_, i) => (
              <Petal key={i} alphaMap={null} />
            ))}
          </group>
        }
      >
        <PetalsWithTexture />
      </Suspense>
    </PetalErrorBoundary>
  );
}
