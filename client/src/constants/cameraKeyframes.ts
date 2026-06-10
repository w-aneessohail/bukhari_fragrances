export type CameraKeyframe = {
  progress: number;
  position: { x: number; y: number; z: number };
  target: { x: number; y: number; z: number };
  fov: number;
};

export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    progress: 0,
    position: { x: 0, y: -0.5, z: 4 },
    target: { x: 0, y: 0.5, z: 0 },
    fov: 45
  },
  {
    progress: 0.22,
    position: { x: -3, y: 2, z: 6 },
    target: { x: 0, y: 0, z: 0 },
    fov: 55
  },
  {
    progress: 0.4,
    position: { x: 3, y: 0.5, z: 5 },
    target: { x: 0, y: 0.5, z: 0 },
    fov: 50
  },
  {
    progress: 0.6,
    position: { x: 0, y: 3, z: 9 },
    target: { x: 0, y: 0, z: 0 },
    fov: 65
  },
  {
    progress: 0.77,
    position: { x: 0, y: 1, z: 2.5 },
    target: { x: 0, y: 1.2, z: 0 },
    fov: 35
  },
  {
    progress: 0.92,
    position: { x: 0, y: 0.5, z: 5 },
    target: { x: 0, y: 0.5, z: 0 },
    fov: 45
  }
];
