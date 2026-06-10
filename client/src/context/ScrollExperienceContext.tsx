import { createContext, useContext, type ReactNode } from "react";

export type ScrollExperienceState = {
  progress: number;
  scrollY: number;
  isMobile: boolean;
  lowPerformance: boolean;
};

const ScrollExperienceContext = createContext<ScrollExperienceState>({
  progress: 0,
  scrollY: 0,
  isMobile: false,
  lowPerformance: false
});

export function ScrollExperienceProvider({
  value,
  children
}: {
  value: ScrollExperienceState;
  children: ReactNode;
}) {
  return <ScrollExperienceContext.Provider value={value}>{children}</ScrollExperienceContext.Provider>;
}

export function useScrollExperience() {
  return useContext(ScrollExperienceContext);
}
