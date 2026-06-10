export const SECTIONS = {
  HERO: { start: 0, end: 0.15 },
  ORIGIN: { start: 0.15, end: 0.3 },
  CRAFT: { start: 0.3, end: 0.5 },
  COLLECTION: { start: 0.5, end: 0.7 },
  EXPERIENCE: { start: 0.7, end: 0.85 },
  CTA: { start: 0.85, end: 1.0 }
} as const;

export type SectionKey = keyof typeof SECTIONS;

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
