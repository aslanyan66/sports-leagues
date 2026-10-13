import { Moon, Sun } from 'lucide-react';

import { useThemeStore } from '@/store/theme.store';

export const ThemeToggle = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className="relative flex size-11 cursor-pointer items-center justify-center rounded-full text-header-fg transition-colors hover:bg-white/15 focus-visible:outline-header-fg"
    >
      <Sun
        aria-hidden="true"
        className="absolute size-5 scale-0 -rotate-90 transition-transform duration-300 dark:scale-100 dark:rotate-0"
      />
      <Moon
        aria-hidden="true"
        className="absolute size-5 scale-100 rotate-0 transition-transform duration-300 dark:scale-0 dark:rotate-90"
      />
    </button>
  );
};
