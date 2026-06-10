import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Component, Suspense, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection, sectionProgress } from "../../constants/scrollSections";
import { EXPERIENCE_TEXTURES } from "../../constants/experienceAssets";
import smokeVert from "../../shaders/smoke.vert.glsl?raw";
import smokeFrag from "../../shaders/smoke.frag.glsl?raw";

const COUNT = 800;

function MistPoints({ mistMap }: { mistMap: THREE.Texture | null }) {
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
      positions[i3] = (Math.random() - 0.5) * 0.35;
      positions[i3 + 1] = 1.4 + Math.random() * 0.35;
      positions[i3 + 2] = (Math.random() - 0.5) * 0.35;
      lives[i] = Math.random();
      sizes[i] = 0.08 + Math.random() * 0.2;
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
  }, [count, mistMap]);

  useFrame((state) => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;

    const craft = sectionProgress(progress, "CRAFT");
    const experience = sectionProgress(progress, "EXPERIENCE");
    let intensity = 0;

    if (isInSection(progress, "CRAFT")) {
      intensity = craft * 0.65;
    } else if (isInSection(progress, "EXPERIENCE")) {
      intensity = 0.65 + experience * 0.35;
    }

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uIntensity.value = intensity;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

function MistWithTexture() {
  const mistMap = useTexture(EXPERIENCE_TEXTURES.mistWhite);
  return <MistPoints mistMap={mistMap} />;
}

class MistErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <MistPoints mistMap={null} />;
    return this.props.children;
  }
}

export default function SmokeParticles() {
  const { progress } = useScrollExperience();

  if (!isInSection(progress, "CRAFT") && !isInSection(progress, "EXPERIENCE") && progress < 0.3) {
    return null;
  }

  return (
    <MistErrorBoundary>
      <Suspense fallback={<MistPoints mistMap={null} />}>
        <MistWithTexture />
      </Suspense>
    </MistErrorBoundary>
  );
}
