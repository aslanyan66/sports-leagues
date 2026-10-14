import { QueryClientProvider, type QueryClient } from '@tanstack/react-query';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StrictMode, type ReactElement } from 'react';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';

import { routes as appRoutes } from '@/app/routes';
import { createQueryClient } from '@/lib/query-client';

const createTestQueryClient = (): QueryClient => {
  const client = createQueryClient();
  // Same caching behavior as the app, but fail fast instead of retrying.
  client.setDefaultOptions({
    queries: { ...client.getDefaultOptions().queries, retry: false },
  });
  return client;
};

interface IProviderOptions extends RenderOptions {
  queryClient?: QueryClient;
}

/** Renders like the app does: StrictMode + a fresh QueryClient per test. */
export const renderWithProviders = (
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...options }: IProviderOptions = {},
) => ({
  user: userEvent.setup(),
  queryClient,
  ...render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </StrictMode>,
    options,
  ),
});

/** Renders the real app routes (or custom ones) at a given URL. */
export const renderRoute = (
  path: string,
  { routes = appRoutes, ...options }: IProviderOptions & { routes?: RouteObject[] } = {},
) => {
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return { router, ...renderWithProviders(<RouterProvider router={router} />, options) };
};
