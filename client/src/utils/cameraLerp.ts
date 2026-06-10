import * as THREE from "three";
import { CAMERA_KEYFRAMES, type CameraKeyframe } from "../constants/cameraKeyframes";
import { easeInOutCubic } from "./easing";

function lerpKeyframe(a: CameraKeyframe, b: CameraKeyframe, t: number) {
  const e = easeInOutCubic(t);
  return {
    position: new THREE.Vector3(
      THREE.MathUtils.lerp(a.position.x, b.position.x, e),
      THREE.MathUtils.lerp(a.position.y, b.position.y, e),
      THREE.MathUtils.lerp(a.position.z, b.position.z, e)
    ),
    target: new THREE.Vector3(
      THREE.MathUtils.lerp(a.target.x, b.target.x, e),
      THREE.MathUtils.lerp(a.target.y, b.target.y, e),
      THREE.MathUtils.lerp(a.target.z, b.target.z, e)
    ),
    fov: THREE.MathUtils.lerp(a.fov, b.fov, e)
  };
}

export function getCameraStateAtProgress(progress: number) {
  const frames = CAMERA_KEYFRAMES;
  const clamped = Math.min(1, Math.max(0, progress));

  let i = 0;
  while (i < frames.length - 1 && frames[i + 1].progress < clamped) {
    i += 1;
  }

  const current = frames[i];
  const next = frames[Math.min(i + 1, frames.length - 1)];

  if (current.progress === next.progress) {
    return lerpKeyframe(current, next, 0);
  }

  const localT = (clamped - current.progress) / (next.progress - current.progress);
  return lerpKeyframe(current, next, Math.min(1, Math.max(0, localT)));
}
