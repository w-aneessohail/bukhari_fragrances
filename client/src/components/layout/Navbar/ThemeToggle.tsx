import { ThemeMode } from "../../../enums/ThemeMode";
import { MoonIcon, SunIcon } from "../../icons/NavIcons";
import { useThemeStore } from "../../../store/themeStore";

type ThemeToggleProps = {
  variant?: "default" | "light";
};

export default function ThemeToggle({ variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === ThemeMode.DARK;
  const isLight = variant === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`rounded-full p-2 transition hover:text-accent-gold ${
        isLight ? "text-[#F5EDD6]/80 hover:bg-white/10" : "text-text-secondary hover:bg-card"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
