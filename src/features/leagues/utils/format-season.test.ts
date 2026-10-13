import { describe, expect, it } from 'vitest';

import { formatSeason } from '@/features/leagues/utils/format-season';

describe('formatSeason', () => {
  it('shortens the end year within the same century', () => {
    expect(formatSeason('1992-1993')).toBe('1992–93');
  });

  it('keeps the full end year across centuries', () => {
    expect(formatSeason('1999-2000')).toBe('1999–2000');
  });

  it('returns single-year and unknown formats unchanged', () => {
    expect(formatSeason('2024')).toBe('2024');
    expect(formatSeason('Spring 2024')).toBe('Spring 2024');
  });
});
