import { useQuery } from '@tanstack/react-query';

import { leaguesQueryOptions } from '@/features/leagues/api/leagues.queries';
import { getSportOptions } from '@/features/leagues/utils/get-sport-options';

/** Sport dropdown options derived from the cached league list (no extra request). */
export const useSportOptions = () =>
  useQuery({
    ...leaguesQueryOptions(),
    select: getSportOptions,
  });
