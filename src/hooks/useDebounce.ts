import { useEffect, useState } from 'react';

/** Compared with Object.is, so only primitives: a new object each render would never settle. */
type DebounceValue = string | number | boolean | null | undefined;

interface IUseDebounceOptions<T> {
  /** Values to apply right away instead of after the delay (e.g. a cleared search). */
  isImmediate?: (value: T) => boolean;
}

/**
 * Returns `value` once it has stopped changing for `delayMs`.
 * Values matching `isImmediate` are returned right away, and they also replace any value still
 * waiting, so an older value can't come back after them.
 */
export const useDebounce = <T extends DebounceValue>(
  value: T,
  delayMs = 300,
  { isImmediate }: IUseDebounceOptions<T> = {},
): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const immediate = isImmediate?.(value) ?? false;

  // Adjusting state while rendering (React's pattern for syncing with props): no effect, no extra
  // commit. Runs only when an immediate value differs from the stored one, so it settles at once.
  if (immediate && !Object.is(debouncedValue, value)) {
    setDebouncedValue(value);
  }

  useEffect(() => {
    if (immediate) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delayMs, immediate]);

  return immediate ? value : debouncedValue;
};
