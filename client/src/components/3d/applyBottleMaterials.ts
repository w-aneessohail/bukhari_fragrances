import * as THREE from "three";
import { COLORS } from "../../constants/colors";

type BottleMaterialOptions = {
  glassColor?: string;
  roughnessMap?: THREE.Texture | null;
  labelMap?: THREE.Texture | null;
};

export function applyBottleMaterials(object: THREE.Object3D, options: BottleMaterialOptions = {}) {
  const glassColor = options.glassColor ?? "#C8A96E";

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const name = child.name.toLowerCase();
    const isCap = name.includes("cap") || name.includes("lid") || name.includes("top");

    if (isCap) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(COLORS.gold),
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 2.5
      });
      return;
    }

    child.material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(glassColor),
      transmission: 0.94,
      roughness: 0.06,
      metalness: 0,
      ior: 1.48,
      thickness: 0.45,
      envMapIntensity: 2,
      transparent: true,
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
