import { LeagueListSkeleton } from '@/features/leagues/components/results/LeagueListSkeleton';
import { LeagueResultsCount } from '@/features/leagues/components/results/LeagueResultsCount';
import { LeagueResultsEmpty } from '@/features/leagues/components/results/LeagueResultsEmpty';
import { LeagueResultsError } from '@/features/leagues/components/results/LeagueResultsError';
import { LeagueSportGroups } from '@/features/leagues/components/results/LeagueSportGroups';
import { LEAGUE_SEARCH_INPUT_ID } from '@/features/leagues/constants';
import { useLeagueResults } from '@/features/leagues/hooks/useLeagueResults';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';

// "Clear filters" and "Try again" disappear once used, which would drop keyboard focus to the
// page start. The search field is always there and is where the user continues from.
const focusSearch = () => {
  document.getElementById(LEAGUE_SEARCH_INPUT_ID)?.focus();
};

/** Results section: picks loading, error, empty, or the leagues grouped by sport. */
export const LeagueResults = () => {
  const { query, appliedFilters } = useLeagueResults();
  const clearFilters = useLeaguesUiStore((state) => state.clearFilters);
  const { data, isPending, isError, refetch } = query;

  if (isPending) {
    return <LeagueListSkeleton />;
  }

  if (isError) {
    return (
      <LeagueResultsError
        onRetry={() => {
          void refetch().then((result) => {
            if (result.isSuccess) {
              focusSearch();
            }
          });
        }}
      />
    );
  }

  return (
    <section aria-labelledby="results-heading" className="flex flex-col gap-3">
      <h2 id="results-heading" className="sr-only">
        Leagues
      </h2>
      <LeagueResultsCount count={data.leagues.length} />
      {data.leagues.length === 0 ? (
        <LeagueResultsEmpty
          filters={appliedFilters}
          onClearFilters={() => {
            clearFilters();
            focusSearch();
          }}
        />
      ) : (
        <LeagueSportGroups groups={data.groups} />
      )}
    </section>
  );
};
