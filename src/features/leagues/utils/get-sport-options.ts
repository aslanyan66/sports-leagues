import { DEFAULT_SPORTS } from '@/features/leagues/constants';
import type { ILeague } from '@/features/leagues/types/league';

/**
 * Sports for the dropdown: the default sports plus every sport in the data,
 * de-duplicated and sorted, so filtering by a sport with no leagues is possible (and shows an empty state).
 * Expects normalized (trimmed) leagues.
 */
export const getSportOptions = (leagues: ILeague[]): string[] =>
  [...new Set([...DEFAULT_SPORTS, ...leagues.map((league) => league.strSport)])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
