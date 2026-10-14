import { UNKNOWN_SPORT } from '@/features/leagues/constants';
import type { ILeague } from '@/features/leagues/types/league';
import type { ILeaguesResponseDto } from '@/features/leagues/types/league.dto';
import { trimToNull } from '@/utils/text';

/**
 * Maps the API DTO to app leagues, trimming text once so filters and the sport dropdown compare the
 * same values. A league without a sport gets `UNKNOWN_SPORT`, so it can still be grouped and filtered.
 */
export const normalizeLeagues = (response: ILeaguesResponseDto): ILeague[] =>
  (response.leagues ?? []).map((league) => ({
    idLeague: league.idLeague,
    strLeague: trimToNull(league.strLeague) ?? '',
    strSport: trimToNull(league.strSport) ?? UNKNOWN_SPORT,
    strLeagueAlternate: trimToNull(league.strLeagueAlternate),
  }));
