import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useScrollExperience } from "../../context/ScrollExperienceContext";
import { getCameraStateAtProgress } from "../../utils/cameraLerp";

export default function CameraRig() {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const { progress } = useScrollExperience();

  useFrame(() => {
    const state = getCameraStateAtProgress(progress);
    camera.position.lerp(state.position, 0.08);
    targetRef.current.lerp(state.target, 0.08);

    if ("fov" in camera && camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, state.fov, 0.08);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(targetRef.current);
  });

  return null;
}
