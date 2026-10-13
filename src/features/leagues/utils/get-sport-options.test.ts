import { describe, expect, it } from 'vitest';

import { getSportOptions } from '@/features/leagues/utils/get-sport-options';
import { mockLeagues } from '@/testing/mocks/data';

describe('getSportOptions', () => {
  it('merges the default sports with sports from the data, sorted and unique', () => {
    expect(getSportOptions(mockLeagues)).toEqual(['Basketball', 'Motorsport', 'Soccer']);
  });

  it('adds sports that are not in the defaults', () => {
    expect(
      getSportOptions([
        { idLeague: '1', strLeague: 'NHL', strSport: 'Ice Hockey', strLeagueAlternate: null },
      ]),
    ).toEqual(['Basketball', 'Ice Hockey', 'Motorsport', 'Soccer']);
  });

  it('skips empty sports', () => {
    expect(
      getSportOptions([
        { idLeague: '1', strLeague: 'A', strSport: 'Soccer', strLeagueAlternate: null },
        { idLeague: '2', strLeague: 'B', strSport: '', strLeagueAlternate: null },
      ]),
    ).toEqual(['Basketball', 'Motorsport', 'Soccer']);
  });

  it('still offers the default sports when there are no leagues', () => {
    expect(getSportOptions([])).toEqual(['Basketball', 'Motorsport', 'Soccer']);
  });
});
