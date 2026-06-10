import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection, sectionProgress } from "../../constants/scrollSections";
import goldDustVert from "../../shaders/goldDust.vert.glsl?raw";
import goldDustFrag from "../../shaders/goldDust.frag.glsl?raw";

const COUNT = 1800;

export default function GoldDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const { progress, isMobile } = useScrollExperience();
  const count = isMobile ? COUNT / 2 : COUNT;

  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const radius = 7 * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.cos(phi) * 0.5 + 0.8;
      positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.01 + Math.random() * 0.03;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: goldDustVert,
      fragmentShader: goldDustFrag,
      uniforms: {
        uTime: { value: 0 },
        uIntensity: { value: 0.2 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    return { geometry: geo, material: mat };
  }, [count]);

  useFrame((state) => {
    const mat = pointsRef.current?.material as THREE.ShaderMaterial | undefined;
    if (!mat) return;

    let intensity = 0.12;
    if (isInSection(progress, "HERO")) {
      intensity = 0.18 + sectionProgress(progress, "HERO") * 0.12;
    } else if (isInSection(progress, "POPULAR")) {
      intensity = 0.35 + sectionProgress(progress, "POPULAR") * 0.2;
    } else if (isInSection(progress, "NOTES")) {
      intensity = 0.4 + sectionProgress(progress, "NOTES") * 0.15;
    }

    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uIntensity.value = intensity;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}
