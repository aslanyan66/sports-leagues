import type { ILeague, ILeagueFilterValues } from '@/features/leagues/types/league';

const normalize = (value: string): string => value.trim().toLowerCase();

/**
 * Filters by sport (exact match, null = all sports) and by name.
 * The name search is case-insensitive and also matches alternate names when the API provides them.
 */
export const filterLeagues = (
  leagues: ILeague[],
  { search, sport }: ILeagueFilterValues,
): ILeague[] => {
  const query = normalize(search);

  return leagues.filter((league) => {
    if (sport && league.strSport !== sport) {
      return false;
    }

    if (!query) {
      return true;
    }

    return (
      normalize(league.strLeague).includes(query) ||
      normalize(league.strLeagueAlternate ?? '').includes(query)
    );
  });
};
