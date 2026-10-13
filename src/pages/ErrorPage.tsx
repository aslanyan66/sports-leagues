import { House, RotateCw } from 'lucide-react';
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { MainLayout } from '@/components/layout/MainLayout';
import { renderRouterHomeLink } from '@/components/layout/router-home-link';
import { Button } from '@/components/ui/Button';
import { buttonVariants } from '@/components/ui/button-variants';
import { env } from '@/config/env';
import { ROUTES } from '@/constants/routes';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { getErrorMessage } from '@/utils/error';

/** Route-level error boundary page: shown when anything throws while rendering a route. */
export const ErrorPage = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <MainLayout renderHomeLink={renderRouterHomeLink}>
        <NotFoundPage />
      </MainLayout>
    );
  }

  return (
    <MainLayout renderHomeLink={renderRouterHomeLink}>
      <title>Something went wrong · Sports Leagues</title>
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
