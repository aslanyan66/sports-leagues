import { Link } from 'react-router';

import type { IHomeLinkRenderProps } from '@/components/layout/SiteHeader';
import { ROUTES } from '@/constants/routes';

/** Client-side home link for the site header (no full page reload). Use only inside the router. */
export const renderRouterHomeLink = ({ className, children }: IHomeLinkRenderProps) => (
  <Link to={ROUTES.home} className={className}>
    {children}
  </Link>
);
