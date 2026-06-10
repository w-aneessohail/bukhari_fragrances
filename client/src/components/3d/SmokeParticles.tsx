import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection, sectionProgress } from "../../constants/scrollSections";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";
import { getFloralState } from "../../utils/scrollChoreography";
import smokeVert from "../../shaders/smoke.vert.glsl?raw";
import smokeFrag from "../../shaders/smoke.frag.glsl?raw";

const COUNT = 700;

function MistPoints({ mistMap, origin }: { mistMap: THREE.Texture | null; origin: [number, number, number] }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { progress, isMobile } = useScrollExperience();
  const count = isMobile ? COUNT / 2 : COUNT;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const lives = new Float32Array(count);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positions[i3] = origin[0] + (Math.random() - 0.5) * 0.5;
      positions[i3 + 1] = origin[1] + 0.8 + Math.random() * 0.5;
      positions[i3 + 2] = origin[2] + (Math.random() - 0.5) * 0.5;
      lives[i] = Math.random();
      sizes[i] = 0.1 + Math.random() * 0.22;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aLife", new THREE.BufferAttribute(lives, 1));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    if (mistMap) {
      mistMap.colorSpace = THREE.SRGBColorSpace;
    }

    const mat = new THREE.ShaderMaterial({
      vertexShader: smokeVert,
      fragmentShader: smokeFrag,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0 },
        uMistMap: { value: mistMap ?? new THREE.Texture() },
        uUseMistMap: { value: mistMap ? 1 : 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    return { geometry: geo, material: mat };
  }, [count, mistMap, origin]);

  useFrame((state) => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;

    let intensity = 0;
    if (isInSection(progress, "HERO")) {
      intensity = 0.2 + sectionProgress(progress, "HERO") * 0.15;
    } else if (isInSection(progress, "CATEGORIES")) {
      intensity = 0.25;
    } else {
      intensity = getFloralState(progress, state.clock.elapsedTime).smokeIntensity;
    }

    if (isInSection(progress, "NOTES")) {
      intensity = Math.max(intensity, 0.35);
    }

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uIntensity.value = intensity;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} position={origin} />;
}

function MistWithTexture({ origin }: { origin: [number, number, number] }) {
  const mistMap = useTexture(EXPERIENCE_TEXTURES.mistWhite);
  return <MistPoints mistMap={mistMap} origin={origin} />;
}

class MistErrorBoundary extends Component<{ children: ReactNode; origin: [number, number, number] }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <MistPoints mistMap={null} origin={this.props.origin} />;
    return this.props.children;
  }
}

function MistLayer({ origin }: { origin: [number, number, number] }) {
  const { progress } = useScrollExperience();
  if (progress < 0.12 && !isInSection(progress, "HERO")) return null;
  if (progress > 0.88) return null;

  return (
    <MistErrorBoundary origin={origin}>
      <Suspense fallback={<MistPoints mistMap={null} origin={origin} />}>
        <MistWithTexture origin={origin} />
      </Suspense>
    </MistErrorBoundary>
  );
}

export default function SmokeParticles() {
  return (
    <>
      <MistLayer origin={[1.4, 0, 0]} />
      <MistLayer origin={[0, 0, 0]} />
    </>
  );
}
