import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/storage-keys';

export type Theme = 'light' | 'dark';

interface IThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

const getSystemTheme = (): Theme =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

export const useThemeStore = create<IThemeState>()(
  persist(
    (set) => ({
      theme: getSystemTheme(),
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
      },
    }),
    {
      name: STORAGE_KEYS.theme,
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
