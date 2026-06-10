import { useTexture } from "@react-three/drei";
import { Component, Suspense, type ReactNode } from "react";
import * as THREE from "three";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";

function SandGroundMesh() {
  const maps = useTexture({
    map: EXPERIENCE_TEXTURES.sandDiffuse,
    aoMap: EXPERIENCE_TEXTURES.sandAo
  });

  maps.map.wrapS = maps.map.wrapT = THREE.RepeatWrapping;
  maps.map.repeat.set(4, 4);
  maps.aoMap.wrapS = maps.aoMap.wrapT = THREE.RepeatWrapping;
  maps.aoMap.repeat.set(4, 4);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial
        map={maps.map}
        aoMap={maps.aoMap}
        roughness={0.88}
        metalness={0.04}
        color="#c4a882"
      />
    </mesh>
  );
}

function FallbackGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#2a1a0a" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

class GroundErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
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
