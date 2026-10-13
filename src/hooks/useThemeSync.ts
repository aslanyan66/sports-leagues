import { useEffect } from 'react';

import { useThemeStore } from '@/store/theme.store';

/** Mirrors the theme from the store onto <html data-theme>, which the Tailwind theme tokens key off. */
export const useThemeSync = (): void => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);
};
