import { describe, expect, it } from 'vitest';

import { trimToNull } from '@/utils/text';

describe('trimToNull', () => {
  it('trims text', () => {
    expect(trimToNull('  EPL ')).toBe('EPL');
  });

  it('returns null for empty, blank, null or missing values', () => {
    expect(trimToNull('')).toBeNull();
    expect(trimToNull('   ')).toBeNull();
    expect(trimToNull(null)).toBeNull();
    expect(trimToNull(undefined)).toBeNull();
  });
});
