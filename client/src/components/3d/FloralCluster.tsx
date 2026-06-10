import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { sectionProgress } from "../../constants/scrollSections";
import { EXPERIENCE_MODELS } from "../../constants/experienceAssets";
import FloralTooltip from "../ui/FloralTooltip";
import SafeGlb, { PlaceholderFloral } from "./SafeGlb";

export type FloralId = "floral-rose" | "floral-petal" | "floral-rain-rose";

const FLORALS: {
  id: FloralId;
  modelPath: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  targetHeight: number;
  delay: number;
  label: string;
  placeholderColor: string;
}[] = [
  {
    id: "floral-rose",
    modelPath: EXPERIENCE_MODELS.rose,
    position: [-2.5, 0, 1.5],
    targetHeight: 1.1,
    delay: 0,
    label: "Papa Meilland Rose — hand-selected Damask blooms for Bukhari attars",
    placeholderColor: "#8B2252"
  },
  {
    id: "floral-petal",
    modelPath: EXPERIENCE_MODELS.rosePetal,
    position: [2.0, 0, 0.5],
    rotation: [0, 0.6, 0],
    targetHeight: 0.55,
    delay: 0.1,
    label: "Rose Petal — each petal carries the heart of our floral extractions",
    placeholderColor: "#A03050"
  },
  {
    id: "floral-rain-rose",
    modelPath: EXPERIENCE_MODELS.roseInRain,
    position: [-1.0, 0, -2.0],
    rotation: [0, -0.4, 0],
    targetHeight: 1.0,
    delay: 0.2,
    label: "Rose in the Rain — dew-kissed roses distilled into luminous perfume",
    placeholderColor: "#6B1835"
  }
];

function Floral({
  id,
  modelPath,
  position,
  rotation,
  targetHeight,
  label,
  delay,
  placeholderColor,
  onHover
}: (typeof FLORALS)[number] & { onHover: (id: FloralId | null) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const { progress } = useScrollExperience();
  const origin = sectionProgress(progress, "ORIGIN");
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    const rise = Math.max(0, Math.min(1, (origin - delay) / 0.4));
    const targetY = position[1] + THREE.MathUtils.lerp(-3, 0, rise);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

    const targetScale = hovered ? 1.08 : 1;
    const s = groupRef.current.scale.x;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(s, targetScale, 0.12));
  });

  return (
  <>
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHover(null);
        document.body.style.cursor = "default";
      }}
    >
      <SafeGlb
        url={modelPath}
        rotation={rotation}
        targetHeight={targetHeight}
        fallback={<PlaceholderFloral color={placeholderColor} />}
      />
    </group>
    {hovered ? <FloralTooltip position={position} text={label} /> : null}
  </>
  );
}

export default function FloralCluster() {
  const { progress } = useScrollExperience();
  const origin = sectionProgress(progress, "ORIGIN");
  const [, setHoveredId] = useState<FloralId | null>(null);

  if (origin <= 0 && progress < 0.15) return null;

  return (
    <group>
      {FLORALS.map((floral) => (
        <Floral key={floral.id} {...floral} onHover={setHoveredId} />
      ))}
    </group>
  );
}
