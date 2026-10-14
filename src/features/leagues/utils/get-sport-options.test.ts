import { describe, expect, it } from 'vitest';

import { getSportOptions } from '@/features/leagues/utils/get-sport-options';
import { mockLeagues } from '@/testing/mocks/data';

describe('getSportOptions', () => {
  it('offers only sports from the data, A–Z, with league counts', () => {
    expect(getSportOptions(mockLeagues)).toEqual([
      { sport: 'Motorsport', count: 1 },
      { sport: 'Soccer', count: 3 },
    ]);
  });

  it('adds any new sport the API returns', () => {
    expect(
      getSportOptions([
        ...mockLeagues,
        { idLeague: '1', strLeague: 'NHL', strSport: 'Ice Hockey', strLeagueAlternate: null },
      ]).map((option) => option.sport),
    ).toEqual(['Ice Hockey', 'Motorsport', 'Soccer']);
  });

  it('offers no sports when there are no leagues', () => {
    expect(getSportOptions([])).toEqual([]);
  });
});
