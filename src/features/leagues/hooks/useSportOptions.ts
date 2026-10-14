import { useQuery } from '@tanstack/react-query';

import { leaguesQueryOptions } from '@/features/leagues/api/leagues.queries';
import { getSportOptions } from '@/features/leagues/utils/get-sport-options';

/** Sport dropdown options: the sports in the cached league list, with counts (no extra request). */
export const useSportOptions = () =>
  useQuery({
    ...leaguesQueryOptions(),
    select: getSportOptions,
  });
