import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import { AppErrorFallback } from '@/app/AppErrorFallback';
import { useThemeSync } from '@/hooks/useThemeSync';
import { createQueryClient } from '@/lib/query-client';

import type { ReactNode } from 'react';

// One client for the app's lifetime: it owns the response cache.
const queryClient = createQueryClient();

interface IAppProviderProps {
  children: ReactNode;
}

/** App-wide providers: top-level error boundary, server-state cache, theme sync. */
export const AppProvider = ({ children }: IAppProviderProps) => {
  useThemeSync();

  return (
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};
