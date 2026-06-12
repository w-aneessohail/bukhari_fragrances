import type { ReactNode } from "react";
import ExperiencePageBackground from "../3d/ExperiencePageBackground";
import { ThemeMode } from "../../enums/ThemeMode";
import { useThemeStore } from "../../store/themeStore";
import LightSiteBackground from "./LightSiteBackground";

/** Site-wide backdrop — experience dark or warm light, depending on theme. */
export default function ExperienceSiteShell({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === ThemeMode.DARK;

  return (
    <div className="experience-grain relative min-h-screen bg-bg-primary text-text-primary">
      <div className="pointer-events-none fixed inset-0 z-0">
        {isDark ? <ExperiencePageBackground /> : <LightSiteBackground />}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
