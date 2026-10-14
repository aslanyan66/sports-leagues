import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('a', 300));

    expect(result.current).toBe('a');
  });

  it('applies immediate values at once, and an older pending value never comes back', () => {
    const isEmpty = (value: string) => value === '';
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300, { isImmediate: isEmpty }),
      { initialProps: { value: 'abc' } },
    );

    rerender({ value: '' });
    expect(result.current).toBe('');

    // Typing again right after clearing: the cleared value holds until the delay, never "abc".
    rerender({ value: 'x' });
    expect(result.current).toBe('');

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('x');
  });

  it('only updates after the delay, using the latest value', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'a' },
    });

    rerender({ value: 'ab' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ value: 'abc' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });
});
