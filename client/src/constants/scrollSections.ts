import { easeInOutCubic, easeInOutQuart } from "../utils/easing";

export const SECTIONS = {
  HERO: { start: 0, end: 0.07 },
  CATEGORIES: { start: 0.07, end: 0.17 },
  POPULAR: { start: 0.17, end: 0.35 },
  HERITAGE: { start: 0.35, end: 0.45 },
  CRAFT: { start: 0.45, end: 0.53 },
  RITUAL: { start: 0.53, end: 0.63 },
  NOTES: { start: 0.63, end: 0.86 },
  STORY: { start: 0.86, end: 0.97 }
} as const;

export type SectionKey = keyof typeof SECTIONS;

export const CATEGORIES_TEXT_FULL_AT = 0.12;
export const CATEGORIES_MOVE_END = 0.5;

export const POPULAR_BEAT_COUNT = 3;
export const CRAFT_BEAT_COUNT = 3;
export const NOTES_BEAT_COUNT = 3;
export const HERITAGE_BEAT_COUNT = 3;
export const RITUAL_BEAT_COUNT = 3;

/** Each beat: long hold at full opacity, then a soft eased crossfade into the next. */
export const BEAT_HOLD_RATIO = 0.78;
export const BEAT_FADE_RATIO = 0.22;

export function isInSection(progress: number, section: SectionKey) {
  const { start, end } = SECTIONS[section];
  return progress >= start && progress < end;
}

export function sectionProgress(progress: number, section: SectionKey) {
  const { start, end } = SECTIONS[section];
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return (progress - start) / (end - start);
}

export function categoriesMoveProgress(progress: number) {
  if (!isInSection(progress, "CATEGORIES")) {
    return progress >= SECTIONS.CATEGORIES.end ? 1 : 0;
  }
  const local = sectionProgress(progress, "CATEGORIES");
  return Math.min(1, local / CATEGORIES_MOVE_END);
}

export function categoriesHoldProgress(progress: number) {
  if (!isInSection(progress, "CATEGORIES")) return 0;
  const local = sectionProgress(progress, "CATEGORIES");
  if (local <= CATEGORIES_MOVE_END) return 0;
  return (local - CATEGORIES_MOVE_END) / (1 - CATEGORIES_MOVE_END);
}

export function categoriesTextOpacity(progress: number) {
  if (progress < SECTIONS.CATEGORIES.start) return 0;
  if (progress >= CATEGORIES_TEXT_FULL_AT) return 1;
  return (progress - SECTIONS.CATEGORIES.start) / (CATEGORIES_TEXT_FULL_AT - SECTIONS.CATEGORIES.start);
}

export function categoriesPanelOpacity(progress: number) {
  const fadeOutStart = SECTIONS.POPULAR.start - 0.015;
  const fadeOutEnd = SECTIONS.CATEGORIES.end;
  if (progress < SECTIONS.CATEGORIES.start || progress >= fadeOutEnd) return 0;

  const textOp = categoriesTextOpacity(progress);
  if (progress < fadeOutStart) return textOp;

  const fadeT = (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  return textOp * (1 - Math.min(1, fadeT));
}

export function sectionBeat(progress: number, section: SectionKey, count: number) {
  const local = sectionProgress(progress, section);
  const scaled = local * count;
  const index = Math.min(count - 1, Math.floor(scaled));
  const blend = scaled - index;
  return { index, blend, local };
}

export type BeatSlotVisual = { opacity: number; slide: number };

/**
 * Scroll-linked beat visibility — long hold, then eased crossfade (opacity + slide).
 */
export function beatSlotVisual(
  sectionLocal: number,
  slotIndex: number,
  slotCount: number
): BeatSlotVisual {
  const hold = BEAT_HOLD_RATIO;
  const fade = BEAT_FADE_RATIO;
  const pos = sectionLocal * slotCount;
  const dist = pos - slotIndex;

  if (dist >= 0 && dist < 1) {
    if (dist <= hold) return { opacity: 1, slide: 0 };
    const t = easeInOutQuart(Math.min(1, (dist - hold) / fade));
    return { opacity: 1 - t, slide: easeInOutCubic(t) };
  }

  if (slotIndex > 0) {
    const prevDist = pos - (slotIndex - 1);
    if (prevDist > hold && prevDist <= 1) {
      const t = easeInOutQuart(Math.min(1, (prevDist - hold) / fade));
      const opacity = easeInOutQuart(t);
      return { opacity, slide: 1 - easeInOutCubic(t) };
    }
  }

  if (slotIndex === 0 && pos >= 0 && pos < hold / slotCount + fade / slotCount) {
    return { opacity: 1, slide: 0 };
  }

  return { opacity: 0, slide: 0 };
}

/** @deprecated Use beatSlotVisual — kept for simple opacity-only call sites */
export function beatSlotOpacity(sectionLocal: number, slotIndex: number, slotCount: number) {
  return beatSlotVisual(sectionLocal, slotIndex, slotCount).opacity;
}

function sectionPanelOpacity(section: SectionKey, progress: number, fadeIn = 0.025, fadeOut = 0.03) {
  const { start, end } = SECTIONS[section];
  const fadeInEnd = start + fadeIn;
  const fadeOutStart = end - fadeOut;
  if (progress < start) return 0;
  if (progress >= end) return 0;
  if (progress < fadeInEnd) return (progress - start) / (fadeInEnd - start);
  if (progress >= fadeOutStart) return 1 - (progress - fadeOutStart) / (end - fadeOutStart);
  return 1;
}

export function popularPanelOpacity(progress: number) {
  return sectionPanelOpacity("POPULAR", progress);
}

export function heritagePanelOpacity(progress: number) {
  return sectionPanelOpacity("HERITAGE", progress);
}

export function craftPanelOpacity(progress: number) {
  return sectionPanelOpacity("CRAFT", progress);
}

export function ritualPanelOpacity(progress: number) {
  return sectionPanelOpacity("RITUAL", progress);
}

export function notesPanelOpacity(progress: number) {
  return sectionPanelOpacity("NOTES", progress, 0.03, 0.025);
}

export function reviewsPanelOpacity(progress: number) {
  return notesPanelOpacity(progress);
}

export function storyPanelOpacity(progress: number) {
  return sectionPanelOpacity("STORY", progress, 0.015, 0.02);
}
