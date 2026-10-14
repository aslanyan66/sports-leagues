/** Sport name for leagues the API returns without one, so every league still belongs to a group. */
export const UNKNOWN_SPORT = 'Other';

/** Radix Select can't use an empty string as an item value, so "all sports" gets a sentinel. */
export const ALL_SPORTS_VALUE = 'all';

/** Delay before a typed search is applied to the list. */
export const SEARCH_DEBOUNCE_MS = 250;

/** Number of placeholder cards while leagues load. */
export const LEAGUE_SKELETON_COUNT = 6;
