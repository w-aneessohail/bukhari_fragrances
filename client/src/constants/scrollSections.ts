export const SECTIONS = {
  HERO: { start: 0, end: 0.11 },
  CATEGORIES: { start: 0.11, end: 0.3 },
  POPULAR: { start: 0.3, end: 0.52 },
  NOTES: { start: 0.52, end: 0.79 },
  STORY: { start: 0.79, end: 0.96 }
} as const;

export type SectionKey = keyof typeof SECTIONS;

export const CATEGORIES_TEXT_FULL_AT = 0.16;
export const CATEGORIES_MOVE_END = 0.5;

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
  const fadeOutStart = 0.275;
  const fadeOutEnd = SECTIONS.CATEGORIES.end;
  if (progress < SECTIONS.CATEGORIES.start || progress >= fadeOutEnd) return 0;

  const textOp = categoriesTextOpacity(progress);
  if (progress < fadeOutStart) return textOp;

  const fadeT = (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
  return textOp * (1 - Math.min(1, fadeT));
}

export function popularPanelOpacity(progress: number) {
  const fadeInStart = SECTIONS.POPULAR.start;
  const fadeInEnd = SECTIONS.POPULAR.start + 0.025;
  const fadeOutStart = SECTIONS.POPULAR.end - 0.07;
  if (progress < fadeInStart) return 0;
  if (progress >= SECTIONS.POPULAR.end) return 0;
  if (progress < fadeInEnd) return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  if (progress >= fadeOutStart) {
    return 1 - (progress - fadeOutStart) / (SECTIONS.POPULAR.end - fadeOutStart);
  }
  return 1;
}

export function notesPanelOpacity(progress: number) {
  const fadeInStart = SECTIONS.NOTES.start;
  const fadeInEnd = SECTIONS.NOTES.start + 0.065;
  const fadeOutStart = SECTIONS.NOTES.end - 0.025;
  if (progress < fadeInStart) return 0;
  if (progress >= SECTIONS.NOTES.end) return 0;
  if (progress < fadeInEnd) return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  if (progress >= fadeOutStart) {
    return 1 - (progress - fadeOutStart) / (SECTIONS.NOTES.end - fadeOutStart);
  }
  return 1;
}

/** Full-screen story — long hold so visitors can read comfortably. */
export function storyPanelOpacity(progress: number) {
  const fadeInStart = SECTIONS.STORY.start;
  const fadeInEnd = SECTIONS.STORY.start + 0.015;
  const fadeOutStart = SECTIONS.STORY.end - 0.02;
  if (progress < fadeInStart) return 0;
  if (progress >= SECTIONS.STORY.end) return 0;
  if (progress < fadeInEnd) return (progress - fadeInStart) / (fadeInEnd - fadeInStart);
  if (progress >= fadeOutStart) {
    return 1 - (progress - fadeOutStart) / (SECTIONS.STORY.end - fadeOutStart);
  }
  return 1;
}
