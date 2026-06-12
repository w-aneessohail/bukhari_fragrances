import { ThemeMode } from "../../../enums/ThemeMode";
import { MoonIcon, SunIcon } from "../../icons/NavIcons";
import { useThemeStore } from "../../../store/themeStore";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === ThemeMode.DARK;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-full p-2 text-text-secondary transition hover:bg-card hover:text-accent-gold"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
