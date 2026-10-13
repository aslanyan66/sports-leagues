import { http, HttpResponse } from 'msw';

import { buildUrl } from '@/api/client';
import { API_ENDPOINTS, API_QUERY_PARAMS } from '@/constants/api';
import type { ILeaguesResponseDto, ISeasonsResponseDto } from '@/features/leagues/types/league.dto';
import { mockLeagueDtos, mockSeasonsByLeagueId } from '@/testing/mocks/data';

export const ALL_LEAGUES_URL = buildUrl(API_ENDPOINTS.allLeagues);
export const SEASONS_URL = buildUrl(API_ENDPOINTS.searchAllSeasons);

export const handlers = [
  http.get(ALL_LEAGUES_URL, () =>
    HttpResponse.json<ILeaguesResponseDto>({ leagues: mockLeagueDtos }),
  ),
  http.get(SEASONS_URL, ({ request }) => {
    const id = new URL(request.url).searchParams.get(API_QUERY_PARAMS.id) ?? '';

    return HttpResponse.json<ISeasonsResponseDto>(mockSeasonsByLeagueId[id] ?? { seasons: null });
  }),
];
