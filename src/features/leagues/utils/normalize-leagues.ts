import type { ILeague } from '@/features/leagues/types/league';
import type { ILeaguesResponseDto } from '@/features/leagues/types/league.dto';
import { trimToNull } from '@/utils/text';

/** Maps the API DTO to app leagues, trimming text once so filters and the sport dropdown compare the same values. */
export const normalizeLeagues = (response: ILeaguesResponseDto): ILeague[] =>
  (response.leagues ?? []).map((league) => ({
    idLeague: league.idLeague,
    strLeague: league.strLeague.trim(),
    strSport: league.strSport.trim(),
    strLeagueAlternate: trimToNull(league.strLeagueAlternate),
  }));
