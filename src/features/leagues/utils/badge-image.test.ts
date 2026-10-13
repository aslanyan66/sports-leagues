import { describe, expect, it } from 'vitest';

import { getBadgeImageSources, getBadgeImageUrl } from '@/features/leagues/utils/badge-image';

const BADGE = 'https://r2.thesportsdb.com/images/media/league/badgearchive/02egea1661959225.png';

describe('getBadgeImageUrl', () => {
  it('appends the size to the image URL', () => {
    expect(getBadgeImageUrl(BADGE, 'small')).toBe(`${BADGE}/small`);
  });

  it('does not double the slash', () => {
    expect(getBadgeImageUrl(`${BADGE}/`, 'tiny')).toBe(`${BADGE}/tiny`);
  });
});

describe('getBadgeImageSources', () => {
  it('uses /small for 1x and the original for 2x, never /medium (404 for season badges)', () => {
    const sources = getBadgeImageSources(BADGE);

    expect(sources).toEqual({
      src: `${BADGE}/small`,
      srcSet: `${BADGE}/small 1x, ${BADGE} 2x`,
      fallbackSrc: BADGE,
    });
    expect(sources.srcSet).not.toContain('/medium');
  });
});
