import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";
import { getGroundOpacity } from "../../utils/scrollChoreography";

function SandGroundMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { progress } = useScrollExperience();
  const maps = useTexture({
    map: EXPERIENCE_TEXTURES.sandDiffuse,
    aoMap: EXPERIENCE_TEXTURES.sandAo
  });

  maps.map.wrapS = maps.map.wrapT = THREE.RepeatWrapping;
  maps.map.repeat.set(5, 5);
  maps.aoMap.wrapS = maps.aoMap.wrapT = THREE.RepeatWrapping;
  maps.aoMap.repeat.set(5, 5);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const opacity = getGroundOpacity(progress);
    mesh.visible = opacity > 0.02;
    const mat = mesh.material as THREE.MeshStandardMaterial;
    mat.transparent = true;
    mat.opacity = opacity;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        map={maps.map}
        aoMap={maps.aoMap}
        roughness={0.92}
        metalness={0.02}
        color="#a89070"
        transparent
        opacity={0}
      />
    </mesh>
  );
}

function FallbackGround() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { progress } = useScrollExperience();

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const opacity = getGroundOpacity(progress) * 0.5;
    mesh.visible = opacity > 0.02;
    (mesh.material as THREE.MeshStandardMaterial).opacity = opacity;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a1208" roughness={0.95} transparent opacity={0} />
    </mesh>
  );
}

class GroundErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <FallbackGround />;
    return this.props.children;
  }
}

export default function SandGround() {
  return (
    <GroundErrorBoundary>
      <Suspense fallback={<FallbackGround />}>
        <SandGroundMesh />
      </Suspense>
    </GroundErrorBoundary>
  );
}
