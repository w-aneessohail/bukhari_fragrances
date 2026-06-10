import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { getFloralState } from "../../utils/scrollChoreography";

const COUNT = 400;

export default function ScentStream() {
  const pointsRef = useRef<THREE.Points>(null);
  const { progress, isMobile } = useScrollExperience();
  const count = isMobile ? COUNT / 2 : COUNT;

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.12;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = Math.random() * 2.5 - 0.5;
      positions[i3 + 2] = Math.sin(angle) * radius;
      seeds[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#f5edd6",
        size: 0.035,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true
      }),
    []
  );

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const floral = getFloralState(progress, state.clock.elapsedTime);
    const intensity = floral.streamIntensity;
    points.visible = intensity > 0.02;

    const mat = points.material as THREE.PointsMaterial;
    mat.opacity = intensity * 0.75;

    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    const seeds = geometry.getAttribute("aSeed") as THREE.BufferAttribute;

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const seed = seeds.getX(i);
      let y = pos.getY(i);
      y += 0.012 + seed * 0.008;
      if (y > 2.2) {
        y = -0.4 - Math.random() * 0.3;
      }
      pos.setY(i, y);
      pos.setX(i, pos.getX(i) + Math.sin(state.clock.elapsedTime * 2 + seed * 10) * 0.001);
    }
    pos.needsUpdate = true;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} position={[0, -0.3, 0]} />;
}
