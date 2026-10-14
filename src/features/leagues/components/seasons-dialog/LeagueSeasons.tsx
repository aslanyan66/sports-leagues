import { CalendarX2, CircleAlert, RefreshCw } from 'lucide-react';

import { StateMessage, Button, Spinner } from '@/components';
import { SeasonCarousel } from '@/features/leagues/components/season-carousel/SeasonCarousel';
import { useSeasons } from '@/features/leagues/hooks/useSeasons';

interface ILeagueSeasonsProps {
  leagueId: string;
  leagueName: string;
}

/** Picks loading, error, "no seasons" or the carousel for one league. */
export const LeagueSeasons = ({ leagueId, leagueName }: ILeagueSeasonsProps) => {
  const { data: seasons, isPending, isError, isRefetching, refetch } = useSeasons(leagueId);

  if (isPending) {
    return <Spinner label="Loading season badges" className="min-h-80" />;
  }

  if (isError) {
    return (
      <StateMessage
        variant="error"
        icon={CircleAlert}
        title="Season badges couldn't load"
        description="Check your internet connection, then try again."
        action={
          <Button variant="secondary" onClick={() => void refetch()} disabled={isRefetching}>
            <RefreshCw aria-hidden="true" />
            Try again
          </Button>
        }
      />
    );
  }

  if (seasons.length === 0) {
    return (
      <StateMessage
        icon={CalendarX2}
        title="No seasons on record"
        description="TheSportsDB has no seasons for this league yet."
      />
    );
  }

  return <SeasonCarousel seasons={seasons} leagueName={leagueName} />;
};
