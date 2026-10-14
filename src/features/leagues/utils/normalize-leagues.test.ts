import { describe, expect, it } from 'vitest';

import { normalizeLeagues } from '@/features/leagues/utils/normalize-leagues';

describe('normalizeLeagues', () => {
  it('trims text fields so filters and dropdown options match', () => {
    expect(
      normalizeLeagues({
        leagues: [
          {
            idLeague: '1',
            strLeague: ' English Premier League ',
            strSport: 'Soccer ',
            strLeagueAlternate: ' EPL ',
          },
        ],
      }),
    ).toEqual([
      {
        idLeague: '1',
        strLeague: 'English Premier League',
        strSport: 'Soccer',
        strLeagueAlternate: 'EPL',
      },
    ]);
  });

  it('turns a missing alternate name into null', () => {
    expect(
      normalizeLeagues({ leagues: [{ idLeague: '1', strLeague: 'A', strSport: 'Soccer' }] }),
    ).toEqual([{ idLeague: '1', strLeague: 'A', strSport: 'Soccer', strLeagueAlternate: null }]);
  });

  it('puts a league without a sport (empty, null or missing) under "Other"', () => {
    const [blank, missing] = normalizeLeagues({
      leagues: [
        { idLeague: '1', strLeague: 'A', strSport: ' ' },
        { idLeague: '2', strLeague: null, strSport: null },
      ],
    });

    expect(blank?.strSport).toBe('Other');
    expect(missing).toMatchObject({ strLeague: '', strSport: 'Other' });
  });

  it('returns an empty list when the API has no leagues', () => {
    expect(normalizeLeagues({ leagues: null })).toEqual([]);
  });
});
