import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeMode } from "../enums/ThemeMode";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  initializeTheme: () => void;
};

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", theme);
}

function detectSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return ThemeMode.LIGHT;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? ThemeMode.DARK
    : ThemeMode.LIGHT;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: ThemeMode.LIGHT,
      setTheme: (theme) => {
        applyTheme(theme);
        set({ theme });
      },
      initializeTheme: () => {
        const storedTheme = get().theme ?? detectSystemTheme();
        applyTheme(storedTheme);
        set({ theme: storedTheme });
      }
    }),
    {
      name: "bukhari-theme"
    }
  )
);
