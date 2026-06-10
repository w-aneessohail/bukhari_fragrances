export const SECTIONS = {
  HERO: { start: 0, end: 0.11 },
  CATEGORIES: { start: 0.11, end: 0.3 },
  POPULAR: { start: 0.36, end: 0.54 },
  NOTES: { start: 0.54, end: 0.78 },
  OUTRO: { start: 0.78, end: 1.0 }
} as const;

export type SectionKey = keyof typeof SECTIONS;

/** Global scroll progress at which categories right text reaches full opacity. */
export const CATEGORIES_TEXT_FULL_AT = 0.2;

/** Within CATEGORIES: bottle travels 0–0.55, then holds until section end. */
export const CATEGORIES_MOVE_END = 0.55;

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

/** Categories right-panel text: fully visible by 20% global scroll. */
export function categoriesTextOpacity(progress: number) {
  if (progress < SECTIONS.CATEGORIES.start) return 0;
  if (progress >= CATEGORIES_TEXT_FULL_AT) return 1;
  return (progress - SECTIONS.CATEGORIES.start) / (CATEGORIES_TEXT_FULL_AT - SECTIONS.CATEGORIES.start);
}

/** Categories panel fades out before POPULAR starts (no overlap with screen 3). */
export function categoriesPanelOpacity(progress: number) {
  const fadeOutStart = 0.27;
  const fadeOutEnd = SECTIONS.CATEGORIES.end;
  if (progress < SECTIONS.CATEGORIES.start || progress >= fadeOutEnd) return 0;

  const textOp = categoriesTextOpacity(progress);
  if (progress < fadeOutStart) return textOp;

  const fadeT = (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  return textOp * (1 - Math.min(1, fadeT));
}

/** Popular panel only appears after categories is fully gone. */
export function popularPanelOpacity(progress: number) {
  const fadeInStart = SECTIONS.POPULAR.start;
  const fadeInEnd = SECTIONS.POPULAR.start + 0.04;
  if (progress < fadeInStart) return 0;
  if (progress >= SECTIONS.POPULAR.end) return 0;
  if (progress < fadeInEnd) return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  return 1;
}
