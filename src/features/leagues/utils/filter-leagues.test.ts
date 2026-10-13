import { describe, expect, it } from 'vitest';

import type { ILeague } from '@/features/leagues/types/league';
import { filterLeagues } from '@/features/leagues/utils/filter-leagues';
import { mockLeagues } from '@/testing/mocks/data';

const names = (leagues: ILeague[]) => leagues.map((league) => league.strLeague);

describe('filterLeagues', () => {
  it('returns every league when no filters are set', () => {
    expect(filterLeagues(mockLeagues, { search: '', sport: null })).toEqual(mockLeagues);
  });

  it('matches the name case-insensitively and ignores surrounding whitespace', () => {
    expect(names(filterLeagues(mockLeagues, { search: '  PREMIER ', sport: null }))).toEqual([
      'English Premier League',
    ]);
  });

  it('matches alternate names when present', () => {
    expect(names(filterLeagues(mockLeagues, { search: 'epl', sport: null }))).toEqual([
      'English Premier League',
    ]);
    expect(names(filterLeagues(mockLeagues, { search: 'f1', sport: null }))).toEqual(['Formula 1']);
  });

  it('handles leagues without an alternate name', () => {
    expect(names(filterLeagues(mockLeagues, { search: 'la liga', sport: null }))).toEqual([
      'Spanish La Liga',
    ]);
  });

  it('filters by sport', () => {
    expect(names(filterLeagues(mockLeagues, { search: '', sport: 'Motorsport' }))).toEqual([
      'Formula 1',
    ]);
  });

  it('returns nothing for a sport with no leagues', () => {
    expect(filterLeagues(mockLeagues, { search: '', sport: 'Basketball' })).toEqual([]);
  });

  it('combines search and sport', () => {
    expect(names(filterLeagues(mockLeagues, { search: 'english', sport: 'Soccer' }))).toEqual([
      'English Premier League',
      'English League Championship',
    ]);
    expect(filterLeagues(mockLeagues, { search: 'english', sport: 'Motorsport' })).toEqual([]);
  });
});
