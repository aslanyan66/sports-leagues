import { RotateCw } from 'lucide-react';

import { ErrorScreen, MainLayout, Button } from '@/components';
import { env } from '@/config/env';
import { getErrorMessage } from '@/utils/error';
import { pageTitle } from '@/utils/page-title';

import type { FallbackProps } from 'react-error-boundary';

/** Last-resort fallback for errors outside the router (e.g. in providers). */
export const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <MainLayout>
    <title>{pageTitle('Something went wrong')}</title>
    <ErrorScreen
      code="500"
      title="Something went wrong"
      description="An unexpected error stopped the app. Try again, or reload the page if it keeps happening."
      details={env.isDev ? getErrorMessage(error) : undefined}
      actions={
        <Button onClick={resetErrorBoundary}>
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      }
    />
  </MainLayout>
);
