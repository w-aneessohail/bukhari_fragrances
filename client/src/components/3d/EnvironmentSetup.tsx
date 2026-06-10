import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { getEnvironmentBlend } from "../../utils/scrollChoreography";
import HdriEnvironment from "./HdriEnvironment";
import SandGround from "./SandGround";

const VOID_COLOR = new THREE.Color("#050403");
const SAND_COLOR = new THREE.Color("#1a1208");
const ROSE_COLOR = new THREE.Color("#180810");
const GOLD_COLOR = new THREE.Color("#141008");

export default function EnvironmentSetup() {
  const { scene } = useThree();
  const { progress } = useScrollExperience();
  const bgColor = useRef(new THREE.Color("#050403"));

  useEffect(() => {
    scene.fog = new THREE.FogExp2("#050403", 0.035);
    scene.background = bgColor.current.clone();
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  useFrame(() => {
    const blend = getEnvironmentBlend(progress);
    bgColor.current.copy(VOID_COLOR).multiplyScalar(Math.max(0.15, blend.void));
    bgColor.current.add(SAND_COLOR.clone().multiplyScalar(blend.sand * 0.4));
    bgColor.current.add(ROSE_COLOR.clone().multiplyScalar(blend.rose * 0.35));
    bgColor.current.add(GOLD_COLOR.clone().multiplyScalar(blend.gold * 0.25));

    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(bgColor.current, 0.04);
    }

    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, 0.02 + blend.rose * 0.025, 0.04);
    }
  });

  return (
    <>
      <HdriEnvironment />

      <ambientLight intensity={0.12} color="#f5edd6" />
      <directionalLight position={[5, 8, 4]} intensity={0.9} color="#fff8ee" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[2, 3, 3]} intensity={2.8} color="#d4af37" distance={12} />
      <pointLight position={[-4, 2, -2]} intensity={0.5} color="#4a1838" distance={10} />
      <pointLight position={[0, -1, 2]} intensity={0.35} color="#8b6914" distance={8} />

      <SandGround />
    </>
  );
}
