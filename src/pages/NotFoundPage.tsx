import { House } from 'lucide-react';
import { Link } from 'react-router';

import { ErrorScreen } from '@/components/feedback/ErrorScreen';
import { buttonVariants } from '@/components/ui/button-variants';
import { ROUTES } from '@/constants/routes';

export const NotFoundPage = () => (
  <>
    <title>Page not found · Sports Leagues</title>
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
