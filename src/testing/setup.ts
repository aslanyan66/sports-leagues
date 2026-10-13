import '@/testing/polyfills';
import '@testing-library/jest-dom/vitest';
// Auto-cleanup needs Vitest `globals: true`; this project imports from 'vitest' explicitly instead.
// eslint-disable-next-line testing-library/no-manual-cleanup
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';
import { useThemeStore } from '@/store/theme.store';
import { server } from '@/testing/mocks/server';

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
});

beforeEach(() => {
  // Zustand stores are module singletons; reset them so tests stay independent.
  useLeaguesUiStore.getState().reset();
  useThemeStore.setState({ theme: 'light' });
  localStorage.clear();
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
