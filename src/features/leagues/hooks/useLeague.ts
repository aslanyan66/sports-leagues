import { useQuery } from '@tanstack/react-query';

import { leaguesQueryOptions } from '@/features/leagues/api/leagues.queries';

/** One league from the cached list (no extra request). */
export const useLeague = (leagueId: string | null) =>
  useQuery({
    ...leaguesQueryOptions(),
    select: (leagues) => leagues.find((league) => league.idLeague === leagueId) ?? null,
  });
