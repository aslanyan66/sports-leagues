import { House, RotateCw } from 'lucide-react';
import { Link, useRouteError } from 'react-router';

import {
  ErrorScreen,
  MainLayout,
  renderRouterHomeLink,
  Button,
  buttonVariants,
} from '@/components';
import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes';
import { getErrorMessage } from '@/utils/error';
import { pageTitle } from '@/utils/page-title';

/**
 * Route-level error boundary page: shown when anything throws while rendering a route.
 * Unknown URLs never get here: the `*` route renders the 404 page instead.
 */
export const ErrorPage = () => {
  const error = useRouteError();

  return (
    <MainLayout renderHomeLink={renderRouterHomeLink}>
      <title>{pageTitle('Something went wrong')}</title>
      <ErrorScreen
        code="500"
        title="Something went wrong"
        description="An unexpected error stopped this page from loading. Reload the page to try again."
        details={env.isDev ? getErrorMessage(error) : undefined}
        actions={
          <>
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              <RotateCw aria-hidden="true" />
              Reload page
            </Button>
            <Link to={ROUTES.home} className={buttonVariants({ variant: 'secondary' })}>
              <House aria-hidden="true" />
              Back to leagues
            </Link>
          </>
        }
      />
    </MainLayout>
  );
};
