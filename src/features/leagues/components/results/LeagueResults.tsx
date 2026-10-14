import { LeagueListSkeleton } from '@/features/leagues/components/results/LeagueListSkeleton';
import { LeagueResultsCount } from '@/features/leagues/components/results/LeagueResultsCount';
import { LeagueResultsEmpty } from '@/features/leagues/components/results/LeagueResultsEmpty';
import { LeagueResultsError } from '@/features/leagues/components/results/LeagueResultsError';
import { LeagueSportGroups } from '@/features/leagues/components/results/LeagueSportGroups';
import { useLeagueResults } from '@/features/leagues/hooks/useLeagueResults';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

/** Results section: picks loading, error, empty, or the leagues grouped by sport. */
export const LeagueResults = () => {
  const { query, appliedFilters } = useLeagueResults();
  const clearFilters = useLeaguesUiStore((state) => state.clearFilters);
  const { data, isPending, isError, isRefetching, refetch } = query;

  if (isPending) {
    return <LeagueListSkeleton />;
  }

  if (isError) {
    return <LeagueResultsError isRetrying={isRefetching} onRetry={() => void refetch()} />;
  }

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-3">
      <h2 id="results-heading" className="sr-only">
        Leagues
      </h2>
      <LeagueResultsCount count={data.leagues.length} />
      {data.leagues.length === 0 ? (
        <LeagueResultsEmpty filters={appliedFilters} onClearFilters={clearFilters} />
      ) : (
        <LeagueSportGroups groups={data.groups} />
      )}
    </section>
  );
};
