import { describe, expect, it } from 'vitest';

import { normalizeSeasons } from '@/features/leagues/utils/normalize-seasons';

describe('normalizeSeasons', () => {
  it('keeps every season in order, with null for missing or blank badges', () => {
    expect(
      normalizeSeasons({
        seasons: [
          { strSeason: '1892-1893', strBadge: null },
          { strSeason: '1893-1894', strBadge: '  ' },
          { strSeason: '1894-1895' },
          { strSeason: '1895-1896', strBadge: 'https://example.com/b.png' },
        ],
      }),
    ).toEqual([
      { name: '1892-1893', badgeUrl: null },
      { name: '1893-1894', badgeUrl: null },
      { name: '1894-1895', badgeUrl: null },
      { name: '1895-1896', badgeUrl: 'https://example.com/b.png' },
    ]);
  });

  it('returns an empty list when the API has no seasons', () => {
    expect(normalizeSeasons({ seasons: null })).toEqual([]);
    expect(normalizeSeasons({ seasons: [] })).toEqual([]);
  });
});
