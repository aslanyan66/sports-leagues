import { QueryClient } from '@tanstack/react-query';

// League data and season badges are effectively static, so once fetched they are
// served from cache for the whole session: no refetch on remount, focus or reconnect.
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
    },
  });
