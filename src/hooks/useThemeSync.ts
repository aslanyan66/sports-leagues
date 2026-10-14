import { useEffect } from 'react';

import { useThemeStore } from '@/store/theme.store';

/**
 * Mirrors the theme from the store onto <html data-theme>, which the Tailwind theme tokens key off,
 * and matches the browser bar color (theme-color) to the header of that theme.
 */
export const useThemeSync = (): void => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;

    const headerColor = getComputedStyle(root).getPropertyValue('--header').trim();
    if (headerColor) {
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', headerColor);
    }
  }, [theme]);
};
