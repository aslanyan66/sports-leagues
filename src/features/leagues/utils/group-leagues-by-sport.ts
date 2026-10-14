import type { ILeague, ILeagueSportGroup } from '@/features/leagues/types/league';

/**
 * Groups leagues by `strSport`: one group per sport found in the data, sports A–Z.
 * Leagues keep the API's order inside each group.
 */
export const groupLeaguesBySport = (leagues: readonly ILeague[]): ILeagueSportGroup[] => {
  const groups = new Map<string, ILeague[]>();

  for (const league of leagues) {
    const group = groups.get(league.strSport);

    if (group) {
      group.push(league);
    } else {
      groups.set(league.strSport, [league]);
    }
  }

  return Array.from(groups, ([sport, sportLeagues]) => ({ sport, leagues: sportLeagues })).sort(
    (a, b) => a.sport.localeCompare(b.sport),
  );
};
