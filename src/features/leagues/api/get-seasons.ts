import { apiClient } from '@/api/client';
import { API_ENDPOINTS, API_INCLUDE_BADGES, API_QUERY_PARAMS } from '@/constants/api';
import type { ISeason } from '@/features/leagues/types/league';
import type { ISeasonsResponseDto } from '@/features/leagues/types/league.dto';
import { normalizeSeasons } from '@/features/leagues/utils/normalize-seasons';

export const getSeasons = async (leagueId: string, signal?: AbortSignal): Promise<ISeason[]> => {
  const response = await apiClient.get<ISeasonsResponseDto>(API_ENDPOINTS.searchAllSeasons, {
    params: {
      [API_QUERY_PARAMS.badge]: API_INCLUDE_BADGES,
      [API_QUERY_PARAMS.id]: leagueId,
    },
    signal,
  });

  return normalizeSeasons(response);
};
