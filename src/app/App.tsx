import { createBrowserRouter, RouterProvider } from 'react-router';

import { AppProvider } from '@/app/providers/AppProvider';
import { routes } from '@/app/routes';

const router = createBrowserRouter(routes);

export const App = () => (
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
