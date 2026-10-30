/** One `<option>` of a `FilterSelect`. */
export interface FilterOption<T extends string | number> {
  value: T;
  label: string;
}

/** Sentinel filter value meaning "no filter". */
export const ALL = 'all';
export type All = typeof ALL;

/** Builds options from values and their display labels, optionally led by an "All …" option. */
export function toFilterOptions<T extends string>(
  values: readonly T[],
  labels: Readonly<Record<T, string>>,
): FilterOption<T>[];
export function toFilterOptions<T extends string>(
  values: readonly T[],
  labels: Readonly<Record<T, string>>,
  allLabel: string,
): FilterOption<T | All>[];
export function toFilterOptions<T extends string>(
  values: readonly T[],
  labels: Readonly<Record<T, string>>,
  allLabel?: string,
): FilterOption<T | All>[] {
  const options: FilterOption<T | All>[] = values.map((value) => ({ value, label: labels[value] }));
  return allLabel ? [{ value: ALL, label: allLabel }, ...options] : options;
}
