import { LeagueList } from '@/features/leagues/components/LeagueList';
import { LeagueListSkeleton } from '@/features/leagues/components/LeagueListSkeleton';
import { LeagueResultsCount } from '@/features/leagues/components/LeagueResultsCount';
import { LeagueResultsEmpty } from '@/features/leagues/components/LeagueResultsEmpty';
import { LeagueResultsError } from '@/features/leagues/components/LeagueResultsError';
import { useFilteredLeagues } from '@/features/leagues/hooks/useFilteredLeagues';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

/** Results section: picks loading, error, empty or list for the current filters. */
export const LeagueResults = () => {
  const { query, appliedFilters } = useFilteredLeagues();
  const clearFilters = useLeaguesUiStore((state) => state.clearFilters);
  const { data: leagues, isPending, isError, isRefetching, refetch } = query;

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
      <LeagueResultsCount count={leagues.length} />
      {leagues.length === 0 ? (
        <LeagueResultsEmpty filters={appliedFilters} onClearFilters={clearFilters} />
      ) : (
        <LeagueList leagues={leagues} />
      )}
    </section>
  );
};
