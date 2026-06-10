import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { sectionProgress } from "../../constants/scrollSections";
import { EXPERIENCE_MODELS } from "../../constants/experienceAssets";
import PerfumeBottle from "./PerfumeBottle";

const BOTTLES = [
  {
    name: "Al Fajar",
    arabic: "الفجر",
    notes: "Oud · Saffron · Amber",
    price: "PKR 8,900",
    glassColor: "#C8A96E",
    position: [-4.5, 0, 0] as [number, number, number],
    slug: "bukhari-oud-royale",
    modelPath: EXPERIENCE_MODELS.heroBottle,
    targetHeight: 1.6
  },
  {
    name: "Oud Noir",
    arabic: "عود نوار",
    notes: "Agarwood · Rose · Musk",
    price: "PKR 7,900",
    glassColor: "#1A0A05",
    position: [-1.5, 0, 0] as [number, number, number],
    slug: "bukhari-oud-royale",
    modelPath: EXPERIENCE_MODELS.purpleBottle,
    targetHeight: 1.55
  },
  {
    name: "Ward",
    arabic: "ورد",
    notes: "Damask Rose · Jasmine · Sandalwood",
    price: "PKR 5,900",
    glassColor: "#5C1A2E",
    position: [1.5, 0, 0] as [number, number, number],
    slug: "jasmine-dusk",
    modelPath: EXPERIENCE_MODELS.heroBottle,
    targetHeight: 1.5
  },
  {
    name: "Dhahab",
    arabic: "ذهب",
    notes: "Amber · Vanilla · Tobacco",
    price: "PKR 7,600",
    glassColor: "#B8860B",
    position: [4.5, 0, 0] as [number, number, number],
    slug: "lahore-midnight-amber",
    modelPath: EXPERIENCE_MODELS.purpleBottle,
    targetHeight: 1.55
  }
];

function CollectionBottle({
  bottle,
  index
}: {
  bottle: (typeof BOTTLES)[number];
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { progress } = useScrollExperience();
  const collection = sectionProgress(progress, "COLLECTION");

  useFrame(() => {
    if (!groupRef.current) return;
    const stagger = index * 0.12;
    const rise = Math.max(0, Math.min(1, (collection - stagger) / 0.5));
    const targetY = THREE.MathUtils.lerp(-5, bottle.position[1], rise);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

    const scale = hovered ? 1.08 : 1;
    groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, scale, 0.12));

    if (hovered) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, 0, 0.1);
    }
  });

  if (collection <= 0 && progress < 0.5) return null;

  return (
    <group
      ref={groupRef}
      position={[bottle.position[0], -5, bottle.position[2]]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <PerfumeBottle
        position={[0, 0, 0]}
        glassColor={bottle.glassColor}
        modelPath={bottle.modelPath}
        targetHeight={bottle.targetHeight}
      />
      {hovered ? (
        <Html position={[0, 2.2, 0]} center distanceFactor={8} style={{ pointerEvents: "auto" }}>
          <div className="w-44 border border-[#D4AF37] bg-[rgba(10,8,4,0.92)] p-4 text-center font-serif text-[#F5EDD6]">
            <p className="text-xs text-[#D4AF37]">{bottle.arabic}</p>
            <p className="mt-1 text-sm font-medium">{bottle.name}</p>
            <p className="mt-2 text-xs text-[#E8DCC8]">{bottle.notes}</p>
            <p className="mt-2 text-xs text-[#D4AF37]">{bottle.price}</p>
            <Link
              to={`/product/${bottle.slug}`}
              className="mt-3 inline-block border border-[#D4AF37] px-3 py-1 text-[10px] uppercase tracking-widest text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A0804]"
            >
              Explore
            </Link>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

export default function BottleCollection() {
  const { progress } = useScrollExperience();
  const collection = sectionProgress(progress, "COLLECTION");

  if (collection <= 0 && progress < 0.48) return null;

  return (
    <group>
      {BOTTLES.map((bottle, index) => (
        <CollectionBottle key={bottle.name} bottle={bottle} index={index} />
      ))}
    </group>
  );
}
