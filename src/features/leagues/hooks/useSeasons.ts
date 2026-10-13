import { useQuery } from '@tanstack/react-query';

import { seasonsQueryOptions } from '@/features/leagues/api/leagues.queries';

/** All seasons (with badges) for a league; cached per league ID, so reopening never refetches. */
export const useSeasons = (leagueId: string) => useQuery(seasonsQueryOptions(leagueId));
