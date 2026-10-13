/** Trims text from the API; empty or missing values become null. */
export const trimToNull = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();

  return trimmed === undefined || trimmed === '' ? null : trimmed;
};
