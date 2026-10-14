import type { ILeague } from '@/features/leagues/types/league';
import type { ILeagueDto, ISeasonsResponseDto } from '@/features/leagues/types/league.dto';
import { normalizeLeagues } from '@/features/leagues/utils/normalize-leagues';

// Raw API responses in the real API's shape, but deliberately richer than the live free-key sample:
// two sports, alternate names on some leagues, and one league whose seasons have no badges.
export const mockLeagueDtos: ILeagueDto[] = [
  {
    idLeague: '4328',
    strLeague: 'English Premier League',
    strSport: 'Soccer',
    strLeagueAlternate: 'Premier League, EPL',
  },
  { idLeague: '4329', strLeague: 'English League Championship', strSport: 'Soccer' },
  { idLeague: '4335', strLeague: 'Spanish La Liga', strSport: 'Soccer', strLeagueAlternate: null },
  { idLeague: '4370', strLeague: 'Formula 1', strSport: 'Motorsport', strLeagueAlternate: 'F1' },
];

/** The same leagues as the app sees them after normalizing. */
export const mockLeagues: ILeague[] = normalizeLeagues({ leagues: mockLeagueDtos });

export const mockSeasonsByLeagueId: Record<string, ISeasonsResponseDto> = {
  '4328': {
    seasons: [
      { strSeason: '1992-1993', strBadge: 'https://example.com/epl-1992.png' },
      { strSeason: '1993-1994', strBadge: 'https://example.com/epl-1993.png' },
      { strSeason: '1994-1995', strBadge: null },
    ],
  },
  '4329': {
    seasons: [
      { strSeason: '1892-1893', strBadge: null },
      { strSeason: '1893-1894', strBadge: null },
    ],
  },
  '4335': { seasons: null },
};
