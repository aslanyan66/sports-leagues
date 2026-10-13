import { CircleAlert, RefreshCw } from 'lucide-react';

import { StateMessage } from '@/components/feedback/StateMessage';
import { Button } from '@/components/ui/Button';

interface ILeagueResultsErrorProps {
  isRetrying: boolean;
  onRetry: () => void;
}

export const LeagueResultsError = ({ isRetrying, onRetry }: ILeagueResultsErrorProps) => (
  <StateMessage
    variant="error"
    icon={CircleAlert}
    title="Leagues couldn't load"
    description="Check your internet connection, then try again."
    action={
      <Button onClick={onRetry} disabled={isRetrying}>
        <RefreshCw aria-hidden="true" />
        Try again
      </Button>
    }
  />
);
