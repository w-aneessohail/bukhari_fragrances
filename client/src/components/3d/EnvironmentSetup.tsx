import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { COLORS } from "../../constants/colors";
import HdriEnvironment from "./HdriEnvironment";
import SandGround from "./SandGround";

export default function EnvironmentSetup() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2(0x1a0f05, 0.06);
    scene.background = new THREE.Color(COLORS.darkBrown);
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  return (
    <>
      <HdriEnvironment />

      <ambientLight intensity={0.18} color={COLORS.creamWhite} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.2}
        color={COLORS.creamWhite}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[2, 4, 2]} intensity={2.5} color={COLORS.amber} />
      <pointLight position={[-3, 1, -2]} intensity={0.35} color="#2a1030" />
      <pointLight position={[0, 2, -4]} intensity={1.4} color={COLORS.gold} />

      <SandGround />
    </>
  );
}
