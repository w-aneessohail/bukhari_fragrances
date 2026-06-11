import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import HdriEnvironment from "./HdriEnvironment";

export default function EnvironmentSetup() {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new THREE.FogExp2("#050403", 0.02);
    scene.background = null;
    return () => {
      scene.fog = null;
      scene.background = null;
    };
  }, [scene]);

  return (
    <>
      <HdriEnvironment />

      <ambientLight intensity={0.12} color="#f5edd6" />
      <directionalLight position={[5, 8, 4]} intensity={0.9} color="#fff8ee" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[2, 3, 3]} intensity={2.8} color="#d4af37" distance={12} />
      <pointLight position={[-4, 2, -2]} intensity={0.5} color="#4a1838" distance={10} />
      <pointLight position={[0, -1, 2]} intensity={0.35} color="#8b6914" distance={8} />
    </>
  );
}
