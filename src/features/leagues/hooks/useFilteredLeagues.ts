import { useQuery } from '@tanstack/react-query';

import { leaguesQueryOptions } from '@/features/leagues/api/leagues.queries';
import { SEARCH_DEBOUNCE_MS } from '@/features/leagues/constants';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';
import type { ILeagueFilterValues } from '@/features/leagues/types/league';
import { filterLeagues } from '@/features/leagues/utils/filter-leagues';
import { useDebounce } from '@/hooks/useDebounce';

/**
 * Leagues from the shared cache, narrowed by the current filters.
 * Typing is debounced, but clearing the search applies immediately.
 * Returns the filters actually applied, so messages match the results on screen.
 */
export const useFilteredLeagues = () => {
  const search = useLeaguesUiStore((state) => state.search);
  const sport = useLeaguesUiStore((state) => state.sport);
  const debouncedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS);
  const appliedFilters: ILeagueFilterValues = {
    search: search === '' ? '' : debouncedSearch,
    sport,
  };

  const query = useQuery({
    ...leaguesQueryOptions(),
    select: (leagues) => filterLeagues(leagues, appliedFilters),
  });

  return { query, appliedFilters };
};
