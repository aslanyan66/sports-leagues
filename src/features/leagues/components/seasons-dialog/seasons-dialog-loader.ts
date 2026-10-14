/** Loads the seasons dialog chunk. Called on first open, and early on card hover/focus as a preload. */
export const loadLeagueSeasonsDialog = () =>
  import('@/features/leagues/components/seasons-dialog/LeagueSeasonsDialog');
