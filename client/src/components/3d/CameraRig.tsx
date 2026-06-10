import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { isInSection } from "../../constants/scrollSections";
import { getCameraStateAtProgress } from "../../utils/cameraLerp";

export default function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const { progress } = useScrollExperience();

  useFrame((state) => {
    const base = getCameraStateAtProgress(progress);
    const breathe = isInSection(progress, "HERO") ? Math.sin(state.clock.elapsedTime * 0.4) * 0.03 : 0;

    camera.position.lerp(
      new THREE.Vector3(base.position.x, base.position.y + breathe, base.position.z),
      0.045
    );
    targetRef.current.lerp(base.target, 0.045);

    if ("fov" in camera && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, base.fov, 0.045);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(targetRef.current);
  });

  return null;
}
