// Everything about the external API in one place. The base URL comes from the environment
// (`VITE_API_URL`, see `src/config/env.ts`); nothing in the app hardcodes hosts or paths.

export const API_TIMEOUT_MS = 15_000;

export const API_ENDPOINTS = {
  allLeagues: '/all_leagues.php',
  searchAllSeasons: '/search_all_seasons.php',
} as const;

/** Query parameter names used by the endpoints above. */
export const API_QUERY_PARAMS = {
  id: 'id',
  badge: 'badge',
} as const;

/** `badge=1` asks search_all_seasons.php to include each season's badge URL. */
export const API_INCLUDE_BADGES = 1;

export const CONTENT_TYPE_JSON = 'application/json';

/**
 * TheSportsDB image CDN serves resized images by appending one of these suffixes to the URL.
 * Season badges usually have NO `/medium` version (404), so only these two are used.
 */
export const IMAGE_SIZES = {
  tiny: 'tiny', // 50px
  small: 'small', // 250px
} as const;

export type ImageSize = (typeof IMAGE_SIZES)[keyof typeof IMAGE_SIZES];
