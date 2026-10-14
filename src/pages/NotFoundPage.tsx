import { House } from 'lucide-react';
import { Link } from 'react-router';

import { ErrorScreen, buttonVariants } from '@/components';
import { ROUTES } from '@/constants/routes';
import { pageTitle } from '@/utils/page-title';

export const NotFoundPage = () => (
  <>
    <title>{pageTitle('Page not found')}</title>
    <ErrorScreen
      code="404"
      title="This page doesn't exist"
      description="The link may be broken, or the page may have moved."
      actions={
        <Link to={ROUTES.home} className={buttonVariants()}>
          <House aria-hidden="true" />
          Back to leagues
        </Link>
      }
    />
  </>
);
