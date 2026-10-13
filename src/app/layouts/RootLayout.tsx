import { Outlet } from 'react-router';

import { MainLayout } from '@/components/layout/MainLayout';
import { renderRouterHomeLink } from '@/components/layout/router-home-link';

export const RootLayout = () => (
  <MainLayout renderHomeLink={renderRouterHomeLink}>
    <Outlet />
  </MainLayout>
);
