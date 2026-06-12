export type CameraKeyframe = {
  progress: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
};

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    progress: 0,
    position: { x: -4.25, y: 1.08, z: 4.05 },
    target: { x: 0.75, y: 1.58, z: 0 },
    fov: 35
  },
  {
    progress: 0.07,
    position: { x: -3.85, y: 1.0, z: 3.9 },
    target: { x: 0.45, y: 1.52, z: 0 },
    fov: 37
  },
  {
    progress: 0.12,
    position: { x: 0.7, y: 0.25, z: 5 },
    target: { x: -0.15, y: 0.05, z: 0 },
    fov: 40
  },
  {
    progress: 0.17,
    position: { x: 0.25, y: 0.32, z: 5.4 },
    target: { x: -0.05, y: -0.12, z: 0 },
    fov: 43
  },
  {
    progress: 0.28,
    position: { x: 0, y: 0.38, z: 5.6 },
    target: { x: 0, y: -0.15, z: 0 },
    fov: 44
  },
  {
    progress: 0.35,
    position: { x: -0.05, y: 0.39, z: 5.7 },
    target: { x: 0, y: -0.13, z: 0 },
    fov: 44
  },
  {
    progress: 0.45,
    position: { x: -0.1, y: 0.4, z: 5.75 },
    target: { x: 0, y: -0.12, z: 0 },
    fov: 45
  },
  {
    progress: 0.53,
    position: { x: -0.12, y: 0.41, z: 5.8 },
    target: { x: 0, y: -0.11, z: 0 },
    fov: 45
  },
  {
    progress: 0.63,
    position: { x: -0.15, y: 0.42, z: 5.85 },
    target: { x: 0, y: -0.1, z: 0 },
    fov: 46
  },
  {
    progress: 0.86,
    position: { x: 0, y: 0.35, z: 5.5 },
    target: { x: 0, y: 0, z: 0 },
    fov: 44
  }
];
