export type CameraKeyframe = {
  progress: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
};

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    progress: 0,
    position: { x: -1.15, y: 0.35, z: 5.5 },
    target: { x: 2.1, y: 0.45, z: 0 },
    fov: 36
  },
  {
    progress: 0.11,
    position: { x: -1.05, y: 0.3, z: 5.2 },
    target: { x: 2.0, y: 0.4, z: 0 },
    fov: 38
  },
  {
    progress: 0.22,
    position: { x: 0.6, y: 0.25, z: 5 },
    target: { x: -0.5, y: 0.05, z: 0 },
    fov: 40
  },
  {
    progress: 0.3,
    position: { x: 0.9, y: 0.3, z: 5.3 },
    target: { x: -0.7, y: -0.05, z: 0 },
    fov: 42
  },
  {
    progress: 0.36,
    position: { x: 0.2, y: 0.35, z: 5.5 },
    target: { x: 0, y: 0.08, z: 0 },
    fov: 43
  },
  {
    progress: 0.44,
    position: { x: 0, y: 0.4, z: 5.6 },
    target: { x: 0, y: 0.1, z: 0 },
    fov: 44
  },
  {
    progress: 0.54,
    position: { x: -0.2, y: 0.45, z: 5.8 },
    target: { x: 0, y: 0.12, z: 0 },
    fov: 46
  },
  {
    progress: 0.68,
    position: { x: 0, y: 0.5, z: 6 },
    target: { x: 0, y: 0.1, z: 0 },
    fov: 48
  },
  {
    progress: 0.78,
    position: { x: 0, y: 0.35, z: 5.5 },
    target: { x: 0, y: 0, z: 0 },
    fov: 44
  }
];
