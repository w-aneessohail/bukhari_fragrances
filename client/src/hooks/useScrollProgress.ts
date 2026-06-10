import { useScrollExperience } from "../context/ScrollExperienceContext";

/** Returns normalized scroll progress (0–1) from ScrollExperienceContext. */
export function useScrollProgress() {
  const { progress, scrollY } = useScrollExperience();
  return { progress, scrollY };
}
