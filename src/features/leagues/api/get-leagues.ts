import { apiClient } from '@/api/client';
import { API_ENDPOINTS } from '@/constants/api';
import type { ILeague } from '@/features/leagues/types/league';
import type { ILeaguesResponseDto } from '@/features/leagues/types/league.dto';
import { normalizeLeagues } from '@/features/leagues/utils/normalize-leagues';

export const getLeagues = async (signal?: AbortSignal): Promise<ILeague[]> => {
  const response = await apiClient.get<ILeaguesResponseDto>(API_ENDPOINTS.allLeagues, { signal });

  return normalizeLeagues(response);
};
