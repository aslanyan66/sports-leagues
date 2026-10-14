import { queryOptions } from '@tanstack/react-query';

import { getLeagues } from '@/features/leagues/api/get-leagues';
import { getSeasons } from '@/features/leagues/api/get-seasons';

// Query key factory: `all` is the prefix for everything league-related,
// so `list` and each league's `seasons` can be invalidated separately or together.
const leagueKeys = {
  all: ['leagues'] as const,
  list: () => [...leagueKeys.all, 'list'] as const,
  seasons: (leagueId: string) => [...leagueKeys.all, 'seasons', leagueId] as const,
};

// The query functions deliberately don't pass TanStack's AbortSignal to fetch. If they did, a
// request would be cancelled whenever its last component unmounts (e.g. closing the dialog, or
// React StrictMode's dev-only remount) and then sent again. The data is cached for the whole
// session, so letting an in-flight request finish is cheaper than repeating it.
export const leaguesQueryOptions = () =>
  queryOptions({
    queryKey: leagueKeys.list(),
    queryFn: () => getLeagues(),
  });

export const seasonsQueryOptions = (leagueId: string) =>
  queryOptions({
    queryKey: leagueKeys.seasons(leagueId),
    queryFn: () => getSeasons(leagueId),
  });
