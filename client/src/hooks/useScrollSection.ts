import { useMemo } from "react";
import { SECTIONS, type SectionKey } from "../constants/scrollSections";

export function useScrollSection(progress: number) {
  return useMemo(() => {
    const active = (Object.keys(SECTIONS) as SectionKey[]).find((key) => {
      const { start, end } = SECTIONS[key];
      return progress >= start && progress < end;
    });

    return active ?? "CTA";
  }, [progress]);
}
