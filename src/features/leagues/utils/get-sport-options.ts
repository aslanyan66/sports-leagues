import type { ILeague } from '@/features/leagues/types/league';
import { groupLeaguesBySport } from '@/features/leagues/utils/group-leagues-by-sport';

export interface ISportOption {
  sport: string;
  /** Number of leagues of this sport in the data. */
  count: number;
}

/** Sports for the dropdown: only sports the API returned, A–Z, each with its league count. */
export const getSportOptions = (leagues: readonly ILeague[]): ISportOption[] =>
  groupLeaguesBySport(leagues).map(({ sport, leagues: sportLeagues }) => ({
    sport,
    count: sportLeagues.length,
  }));
