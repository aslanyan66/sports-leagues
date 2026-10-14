import { useQuery } from '@tanstack/react-query';

import { leaguesQueryOptions } from '@/features/leagues/api/leagues.queries';
import { SEARCH_DEBOUNCE_MS } from '@/features/leagues/constants';
import { useLeaguesUiStore } from '@/features/leagues/store/leagues-ui.store';
import type { ILeagueFilterValues } from '@/features/leagues/types/league';
import { filterLeagues } from '@/features/leagues/utils/filter-leagues';
import { groupLeaguesBySport } from '@/features/leagues/utils/group-leagues-by-sport';
import { useDebounce } from '@/hooks';

// A cleared search applies at once, so "Clear" (or deleting the text) shows every league right away.
const isEmptySearch = (search: string) => search === '';

/**
 * Leagues from the shared cache: filtered, then grouped by sport (`strSport`).
 * `leagues` is the flat result (for the count), `groups` the same leagues per sport (for rendering).
 * Typing is debounced, but clearing the search applies immediately. Returns the filters actually
 * applied, so messages match the results on screen.
 */
export const useLeagueResults = () => {
  const search = useLeaguesUiStore((state) => state.search);
  const sport = useLeaguesUiStore((state) => state.sport);
  const appliedSearch = useDebounce(search, SEARCH_DEBOUNCE_MS, { isImmediate: isEmptySearch });
  const appliedFilters: ILeagueFilterValues = { search: appliedSearch, sport };

  const query = useQuery({
    ...leaguesQueryOptions(),
    select: (leagues) => {
      const filtered = filterLeagues(leagues, appliedFilters);

      return { leagues: filtered, groups: groupLeaguesBySport(filtered) };
    },
  });

  return { query, appliedFilters };
};
