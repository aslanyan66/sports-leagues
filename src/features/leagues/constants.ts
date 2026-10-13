/** Sports always offered in the filter (from the task brief), merged with any sport found in the data. */
export const DEFAULT_SPORTS = ['Soccer', 'Basketball', 'Motorsport'] as const;

/** Radix Select can't use an empty string as an item value, so "all sports" gets a sentinel. */
export const ALL_SPORTS_VALUE = 'all';

/** Delay before a typed search is applied to the list. */
export const SEARCH_DEBOUNCE_MS = 250;

/** Number of placeholder cards while leagues load. */
export const LEAGUE_SKELETON_COUNT = 6;
