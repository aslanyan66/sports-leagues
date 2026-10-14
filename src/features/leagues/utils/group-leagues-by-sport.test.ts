import { describe, expect, it } from 'vitest';

import { groupLeaguesBySport } from '@/features/leagues/utils/group-leagues-by-sport';
import { mockLeagues } from '@/testing/mocks/data';

const names = (leagues: { strLeague: string }[]) => leagues.map((league) => league.strLeague);

describe('groupLeaguesBySport', () => {
  it('makes one group per sport in the data, sports A–Z', () => {
    expect(groupLeaguesBySport(mockLeagues).map((group) => group.sport)).toEqual([
      'Motorsport',
      'Soccer',
    ]);
  });

  it('keeps the league order inside each group', () => {
    const soccer = groupLeaguesBySport(mockLeagues).find((group) => group.sport === 'Soccer');

    expect(names(soccer?.leagues ?? [])).toEqual([
      'English Premier League',
      'English League Championship',
      'Spanish La Liga',
    ]);
  });

  it('returns no groups for no leagues', () => {
    expect(groupLeaguesBySport([])).toEqual([]);
  });
});
