import type { ISeason } from '@/features/leagues/types/league';
import type { ISeasonsResponseDto } from '@/features/leagues/types/league.dto';
import { trimToNull } from '@/utils/text';

/** Maps the API DTO to app seasons; seasons without a badge are kept (shown as a placeholder). */
export const normalizeSeasons = (response: ISeasonsResponseDto): ISeason[] =>
  (response.seasons ?? []).map((season) => ({
    name: season.strSeason,
    badgeUrl: trimToNull(season.strBadge),
  }));
