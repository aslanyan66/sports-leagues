import { RootLayout } from '@/app/layouts/RootLayout';
import { ROUTES } from '@/constants/routes';
import { ErrorPage } from '@/pages/ErrorPage';
import { LeaguesPage } from '@/pages/LeaguesPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

import type { RouteObject } from 'react-router';

export const routes: RouteObject[] = [
  {
    path: ROUTES.home,
    element: <RootLayout />,
    // Route-level error boundary: replaces the layout when anything below it throws.
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LeaguesPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
