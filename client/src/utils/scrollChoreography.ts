import {
  categoriesMoveProgress,
  SECTIONS,
  sectionProgress
} from "../constants/scrollSections";
import { easeInOutCubic, easeOutCubic } from "./easing";

type Vec3 = { x: number; y: number; z: number };

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) };
}

export type BottleState = {
  position: Vec3;
  scale: number;
  opacity: number;
  interactive: boolean;
};

export function getBottleState(progress: number, time = 0): BottleState {
  const floatY = Math.sin(time * 1.1) * 0.05;
  const heroPos: Vec3 = { x: 3.2, y: 0.4 + floatY, z: 0.1 };
  const categoryPos: Vec3 = { x: -1.65, y: -0.2 + floatY * 0.4, z: -0.05 };
  const exitPos: Vec3 = { x: -4.5, y: -1.2, z: -3.5 };

  const categoriesEnd = SECTIONS.CATEGORIES.end;
  const popularStart = SECTIONS.POPULAR.start;

  if (progress < SECTIONS.HERO.end) {
    const t = easeOutCubic(sectionProgress(progress, "HERO"));
    return {
      position: heroPos,
      scale: lerp(0.9, 1.02, t),
      opacity: 1,
      interactive: true
    };
  }

  if (progress < categoriesEnd) {
    const moveT = easeInOutCubic(categoriesMoveProgress(progress));
    return {
      position: lerpVec(heroPos, categoryPos, moveT),
      scale: lerp(1.02, 0.9, moveT),
      opacity: 1,
      interactive: true
    };
  }

  if (progress < popularStart) {
    const t = easeInOutCubic((progress - categoriesEnd) / (popularStart - categoriesEnd));
    return {
      position: lerpVec(categoryPos, exitPos, t),
      scale: lerp(0.9, 0.12, t),
      opacity: lerp(1, 0, t),
      interactive: t < 0.4
    };
  }

  return { position: exitPos, scale: 0, opacity: 0, interactive: false };
}

export type FloralState = {
  pinkFlowerOpacity: number;
  pinkFlowerY: number;
  pinkFlowerScale: number;
  leafOpacity: number;
  leafY: number;
  leafScale: number;
  smokeIntensity: number;
  streamIntensity: number;
};

export function getFloralState(progress: number, time = 0): FloralState {
  const bob = Math.sin(time * 0.85) * 0.04;
  const empty: FloralState = {
    pinkFlowerOpacity: 0,
    pinkFlowerY: 0,
    pinkFlowerScale: 0,
    leafOpacity: 0,
    leafY: 0,
    leafScale: 0,
    smokeIntensity: 0,
    streamIntensity: 0
  };

  if (progress < SECTIONS.POPULAR.start) return empty;

  if (progress < SECTIONS.POPULAR.end) {
    const t = easeOutCubic(sectionProgress(progress, "POPULAR"));
    return {
      pinkFlowerOpacity: t,
      pinkFlowerY: bob,
      pinkFlowerScale: lerp(0.45, 1.35, t),
      leafOpacity: 0,
      leafY: 0,
      leafScale: 0,
      smokeIntensity: lerp(0, 0.75, t),
      streamIntensity: lerp(0, 0.9, t)
    };
  }

  if (progress < SECTIONS.NOTES.end) {
    const notesT = sectionProgress(progress, "NOTES");
    const swapEnd = 0.38;
    const swapT = easeInOutCubic(Math.min(1, notesT / swapEnd));

    if (notesT <= swapEnd) {
      return {
        pinkFlowerOpacity: lerp(1, 0, swapT),
        pinkFlowerY: lerp(bob, 2.8, swapT),
        pinkFlowerScale: lerp(1.35, 1.1, swapT),
        leafOpacity: swapT,
        leafY: lerp(-2.4, bob, swapT),
        leafScale: lerp(0.4, 1.2, swapT),
        smokeIntensity: lerp(0.75, 0.9, swapT),
        streamIntensity: 0.85
      };
    }

    const holdT = (notesT - swapEnd) / (1 - swapEnd);
    return {
      pinkFlowerOpacity: 0,
      pinkFlowerY: 2.8,
      pinkFlowerScale: 1.1,
      leafOpacity: 1,
      leafY: bob,
      leafScale: lerp(1.2, 1.25, easeOutCubic(holdT)),
      smokeIntensity: lerp(0.9, 0.5, holdT),
      streamIntensity: lerp(0.85, 0.25, holdT)
    };
  }

  return empty;
}

export function getEnvironmentBlend(progress: number) {
  const categoriesEnd = SECTIONS.CATEGORIES.end;
  const popularStart = SECTIONS.POPULAR.start;

  if (progress < SECTIONS.HERO.end) return { void: 1, sand: 0, rose: 0, gold: 0 };
  if (progress < categoriesEnd) {
    const t = sectionProgress(progress, "CATEGORIES");
    return { void: lerp(1, 0.45, t), sand: lerp(0, 0.55, t), rose: 0, gold: 0 };
  }
  if (progress < popularStart) {
    return { void: 0.45, sand: 0.55, rose: 0, gold: 0 };
  }
  if (progress < SECTIONS.POPULAR.end) {
    const t = sectionProgress(progress, "POPULAR");
    return { void: 0.2, sand: 0.3, rose: lerp(0.2, 0.75, t), gold: 0.1 };
  }
  if (progress < SECTIONS.NOTES.end) {
    const t = sectionProgress(progress, "NOTES");
    return { void: 0.12, sand: 0.15, rose: lerp(0.75, 0.35, t), gold: lerp(0.1, 0.5, t) };
  }
  return { void: 0.05, sand: 0.08, rose: 0.12, gold: 0.8 };
}

export function getGroundOpacity(progress: number) {
  if (progress < 0.08) return 0;
  if (progress < SECTIONS.CATEGORIES.end) {
    return easeOutCubic(sectionProgress(progress, "CATEGORIES")) * 0.5;
  }
  if (progress < SECTIONS.POPULAR.start) return 0.5;
  if (progress < SECTIONS.POPULAR.end) return 0.45;
  if (progress < SECTIONS.NOTES.end) {
    return lerp(0.45, 0.2, sectionProgress(progress, "NOTES"));
  }
  return 0.06;
}
