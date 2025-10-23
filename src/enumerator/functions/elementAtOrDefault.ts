import { from } from "./from";

/**
 * Retrieves the element at the specified zero-based index or returns `null` when the index is out of range.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param index Zero-based position of the element to retrieve.
 * @returns {TElement | null} The element at `index`, or `null` when {@link source} is shorter than `index + 1` or when `index` is negative.
 * @remarks Use this overload when out-of-range access should produce a sentinel value instead of throwing an exception.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const element = elementAtOrDefault(numbers, 2);
 * console.log(element); // 3
 *
 * const element2 = elementAtOrDefault(numbers, 10);
 * console.log(element2); // null
 * ```
 */
export const elementAtOrDefault = <TElement>(
    source: Iterable<TElement>,
    index: number
): TElement | null => {
    return from(source).elementAtOrDefault(index);
};
