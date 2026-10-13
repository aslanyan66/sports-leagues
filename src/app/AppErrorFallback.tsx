import { RotateCw } from 'lucide-react';

import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { env } from '@/config/env';
import { getErrorMessage } from '@/utils/error';

import type { FallbackProps } from 'react-error-boundary';

/** Last-resort fallback for errors outside the router (e.g. in providers). */
export const AppErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <MainLayout>
    <title>Something went wrong · Sports Leagues</title>
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
