import { Enumerable, IEnumerable } from "../../imports";

/**
 * Generates a numeric range beginning at the specified start value.
 * @param start Start value of the range.
 * @param count Number of sequential values to produce.
 * @returns {IEnumerable<number>} A sequence of `count` integers starting from {@link start}.
 * @remarks Enumeration is deferred. When {@link count} is zero or negative, the resulting sequence is empty.
 * @example
 * ```typescript
 * const numbers = range(1, 5).toArray();
 * console.log(numbers); // [1, 2, 3, 4, 5]
 * ```
 */
export const range = (start: number, count: number): IEnumerable<number> => {
    return Enumerable.range(start, count);
};
