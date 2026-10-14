import { Outlet } from 'react-router';

import { MainLayout, renderRouterHomeLink } from '@/components';

export const RootLayout = () => (
  <MainLayout renderHomeLink={renderRouterHomeLink}>
    <Outlet />
  </MainLayout>
);
