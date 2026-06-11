import {
  categoriesMoveProgress,
  SECTIONS,
  sectionProgress
} from "../constants/scrollSections";
import { easeInOutCubic, easeOutCubic } from "./easing";

type Vec3 = { x: number; y: number; z: number };

const POPULAR_FLORAL_Y = -0.48;
const NOTES_FLORAL_Y = 0.06;

/** Hero sits right-of-frame via camera aim, not extreme world X (which shrinks on screen). */
const HERO_BOTTLE_X = 6.55;
const HERO_BOTTLE_Y = 1.95;
const HERO_SCALE_MIN = 1.58;
const HERO_SCALE_MAX = 1.88;
const CATEGORY_SCALE = 0.78;
const CATEGORY_BOTTLE_X = -1.48;
const HERO_BOTTLE_ROTATION_Y = -1.78;
const CATEGORY_BOTTLE_ROTATION_Y = 0.72;

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
  baseRotationY: number;
};

export function getBottleState(progress: number, time = 0): BottleState {
  const floatY = Math.sin(time * 1.1) * 0.05;
  const heroPos: Vec3 = { x: HERO_BOTTLE_X, y: HERO_BOTTLE_Y + floatY, z: 0.25 };
  const categoryPos: Vec3 = { x: CATEGORY_BOTTLE_X, y: -0.2 + floatY * 0.4, z: -0.05 };
  const exitPos: Vec3 = { x: -4.5, y: -1.2, z: -3.5 };

  const categoriesEnd = SECTIONS.CATEGORIES.end;
  const bottleExitStart = categoriesEnd - 0.03;

  if (progress < SECTIONS.HERO.end) {
    const t = easeOutCubic(sectionProgress(progress, "HERO"));
    return {
      position: heroPos,
      scale: lerp(HERO_SCALE_MIN, HERO_SCALE_MAX, t),
      opacity: 1,
      interactive: true,
      baseRotationY: HERO_BOTTLE_ROTATION_Y
    };
  }

  if (progress < bottleExitStart) {
    const moveT = easeInOutCubic(categoriesMoveProgress(progress));
    return {
      position: lerpVec(heroPos, categoryPos, moveT),
      scale: lerp(HERO_SCALE_MAX, CATEGORY_SCALE, moveT),
      opacity: 1,
      interactive: true,
      baseRotationY: lerp(HERO_BOTTLE_ROTATION_Y, CATEGORY_BOTTLE_ROTATION_Y, moveT)
    };
  }

  if (progress < categoriesEnd) {
    const t = easeInOutCubic((progress - bottleExitStart) / (categoriesEnd - bottleExitStart));
    return {
      position: lerpVec(categoryPos, exitPos, t),
      scale: lerp(CATEGORY_SCALE, 0.12, t),
      opacity: lerp(1, 0, t),
      interactive: t < 0.35,
      baseRotationY: lerp(CATEGORY_BOTTLE_ROTATION_Y, 0, t)
    };
  }

  return { position: exitPos, scale: 0, opacity: 0, interactive: false, baseRotationY: 0 };
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
      pinkFlowerY: POPULAR_FLORAL_Y + bob,
      pinkFlowerScale: lerp(0.45, 1.35, t),
      leafOpacity: 0,
      leafY: 0,
      leafScale: 0,
      smokeIntensity: lerp(0, 0.55, t),
      streamIntensity: lerp(0, 0.85, t)
    };
  }

  if (progress < SECTIONS.NOTES.end) {
    const notesT = sectionProgress(progress, "NOTES");
    const swapEnd = 0.3;
    const swapT = easeInOutCubic(Math.min(1, notesT / swapEnd));
    const notesBob = NOTES_FLORAL_Y + bob;

    if (notesT <= swapEnd) {
      return {
        pinkFlowerOpacity: lerp(1, 0, swapT),
        pinkFlowerY: lerp(POPULAR_FLORAL_Y + bob, 2.5, swapT),
        pinkFlowerScale: lerp(1.35, 1.0, swapT),
        leafOpacity: swapT,
        leafY: lerp(-2.2, notesBob, swapT),
        leafScale: lerp(0.5, 1.25, swapT),
        smokeIntensity: lerp(0.65, 0.9, swapT),
        streamIntensity: 0
      };
    }

    const holdT = (notesT - swapEnd) / (1 - swapEnd);
    return {
      pinkFlowerOpacity: 0,
      pinkFlowerY: 2.5,
      pinkFlowerScale: 1.0,
      leafOpacity: 1,
      leafY: notesBob,
      leafScale: lerp(1.25, 1.3, easeOutCubic(holdT)),
      smokeIntensity: lerp(0.9, 0.7, holdT),
      streamIntensity: 0
    };
  }

  return empty;
}

export function getEnvironmentBlend(progress: number) {
  if (progress < SECTIONS.HERO.end) return { void: 1, sand: 0, rose: 0, gold: 0 };
  if (progress < SECTIONS.CATEGORIES.end) {
    const t = sectionProgress(progress, "CATEGORIES");
    return { void: lerp(1, 0.45, t), sand: lerp(0, 0.55, t), rose: 0, gold: 0 };
  }
  if (progress < SECTIONS.POPULAR.end) {
    const t = sectionProgress(progress, "POPULAR");
    return { void: 0.2, sand: 0.3, rose: lerp(0.2, 0.75, t), gold: 0.1 };
  }
  if (progress < SECTIONS.NOTES.end) {
    const t = sectionProgress(progress, "NOTES");
    return { void: 0.12, sand: 0.15, rose: lerp(0.75, 0.35, t), gold: lerp(0.1, 0.5, t) };
  }
  if (progress < SECTIONS.STORY.end) {
    const t = sectionProgress(progress, "STORY");
    return { void: 0.05, sand: 0.08, rose: lerp(0.12, 0.05, t), gold: lerp(0.8, 1, t) };
  }
  return { void: 0.03, sand: 0.05, rose: 0.04, gold: 1 };
}

export function getGroundOpacity(progress: number) {
  if (progress < 0.08) return 0;
  if (progress < SECTIONS.CATEGORIES.end) {
    return easeOutCubic(sectionProgress(progress, "CATEGORIES")) * 0.5;
  }
  if (progress < SECTIONS.POPULAR.end) return 0.45;
  if (progress < SECTIONS.NOTES.end) {
    return lerp(0.45, 0.2, sectionProgress(progress, "NOTES"));
  }
  if (progress < SECTIONS.STORY.start + 0.04) {
    return lerp(0.2, 0, (progress - SECTIONS.NOTES.end) / 0.04);
  }
  return 0;
}

export function getCanvasOpacity(progress: number) {
  if (progress < SECTIONS.STORY.start) return 1;
  const fadeEnd = SECTIONS.STORY.start + 0.04;
  if (progress >= fadeEnd) return 0;
  return 1 - (progress - SECTIONS.STORY.start) / (fadeEnd - SECTIONS.STORY.start);
}

