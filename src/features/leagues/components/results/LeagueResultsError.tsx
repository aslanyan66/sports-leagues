import { CircleAlert, RefreshCw } from 'lucide-react';

import { StateMessage, Button } from '@/components';

interface ILeagueResultsErrorProps {
  onRetry: () => void;
}

/** Retrying swaps this for the loading skeleton (the query goes back to pending). */
export const LeagueResultsError = ({ onRetry }: ILeagueResultsErrorProps) => (
  <StateMessage
    variant="error"
    icon={CircleAlert}
    title="Leagues couldn't load"
    description="Check your internet connection, then try again."
    action={
      <Button onClick={onRetry}>
        <RefreshCw aria-hidden="true" />
        Try again
      </Button>
    }
  />
);
