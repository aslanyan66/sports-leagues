/** "1992-1993" → "1992–93" for display; anything else is returned unchanged. */
export const formatSeason = (season: string): string => {
  const match = /^(\d{4})-(\d{4})$/.exec(season.trim());

  if (!match) {
    return season;
  }

  const [, start = '', end = ''] = match;
  return start.slice(0, 2) === end.slice(0, 2) ? `${start}–${end.slice(2)}` : `${start}–${end}`;
};
