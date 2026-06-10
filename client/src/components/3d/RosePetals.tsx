import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection } from "../../constants/scrollSections";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

const COUNT = 45;

function PetalMesh({ alphaMap }: { alphaMap: THREE.Texture | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const seed = useMemo(() => Math.random() * 100, []);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#c06080",
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.88,
        roughness: 0.65,
        alphaMap: alphaMap ?? undefined,
        alphaTest: alphaMap ? 0.15 : 0,
        depthWrite: !alphaMap
      }),
    [alphaMap]
  );

  const reset = (mesh: THREE.Mesh) => {
    mesh.position.x = (Math.random() - 0.5) * 8;
    mesh.position.y = 6 + Math.random() * 3;
    mesh.position.z = (Math.random() - 0.5) * 4;
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  };

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.position.y -= delta * (0.25 + (seed % 0.2));
    mesh.position.x += Math.sin(state.clock.elapsedTime + seed) * delta * 0.12;
    mesh.rotation.x += delta * 0.45;
    mesh.rotation.z += delta * 0.28;
    if (mesh.position.y < -2) reset(mesh);
  });

  return (
    <mesh ref={meshRef} material={material} castShadow>
      <planeGeometry args={[0.16, 0.22]} />
    </mesh>
  );
}

function PetalsWithTexture() {
  const alphaMap = useTexture(EXPERIENCE_TEXTURES.rosePetalAlpha);
  alphaMap.colorSpace = THREE.SRGBColorSpace;
  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => (
        <PetalMesh key={i} alphaMap={alphaMap} />
      ))}
    </group>
  );
}

class PetalErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          {Array.from({ length: COUNT }, (_, i) => (
            <PetalMesh key={i} alphaMap={null} />
          ))}
        </group>
      );
    }
    return this.props.children;
  }
}

export default function RosePetals() {
  const { progress } = useScrollExperience();
  const active = isInSection(progress, "POPULAR") || isInSection(progress, "NOTES");

  if (!active) return null;

  return (
    <PetalErrorBoundary>
      <Suspense
        fallback={
          <group>
            {Array.from({ length: COUNT }, (_, i) => (
              <PetalMesh key={i} alphaMap={null} />
            ))}
          </group>
        }
      >
        <PetalsWithTexture />
      </Suspense>
    </PetalErrorBoundary>
  );
}
