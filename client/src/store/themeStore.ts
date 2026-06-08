import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeMode } from "../enums/ThemeMode";

type ThemeState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
};

function normalizeTheme(theme: ThemeMode | string): ThemeMode {
  return theme === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT;
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.setAttribute("data-theme", normalizeTheme(theme));
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
        const normalized = normalizeTheme(theme);
        applyTheme(normalized);
        set({ theme: normalized });
      },
      toggleTheme: () => {
        const next =
          get().theme === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK;
        applyTheme(next);
        set({ theme: next });
      },
      initializeTheme: () => {
        const storedTheme = normalizeTheme(get().theme ?? detectSystemTheme());
        applyTheme(storedTheme);
        set({ theme: storedTheme });
      }
    }),
    {
      name: "bukhari-theme"
    }
  )
);
