import * as THREE from "three";
import { COLORS } from "../../constants/colors";

type BottleMaterialOptions = {
  glassColor?: string;
  roughnessMap?: THREE.Texture | null;
  labelMap?: THREE.Texture | null;
};

export function applyBottleMaterials(object: THREE.Object3D, options: BottleMaterialOptions = {}) {
  const glassColor = options.glassColor ?? "#d4c4a0";

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const name = child.name.toLowerCase();
    const isCap = name.includes("cap") || name.includes("lid") || name.includes("top");

    if (isCap) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(COLORS.gold),
        metalness: 1,
        roughness: 0.08,
        envMapIntensity: 3.5,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      });
      return;
    }

    child.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(glassColor),
      transmission: 0.97,
      roughness: 0.02,
      metalness: 0.05,
      ior: 1.52,
      thickness: 0.55,
      envMapIntensity: 3,
      transparent: true,
      clearcoat: 0.4,
      clearcoatRoughness: 0.05,
      roughnessMap: options.roughnessMap ?? null
    });
  });
}

export function createLabelPlane(labelMap: THREE.Texture) {
  labelMap.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.18),
    new THREE.MeshStandardMaterial({
      map: labelMap,
      transparent: true,
      roughness: 0.55,
      metalness: 0.05,
      depthWrite: false
    })
  );
  mesh.position.set(0, 0.15, 0.31);
  return mesh;
}
