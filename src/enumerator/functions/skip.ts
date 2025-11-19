import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Skips a specified number of elements before yielding the remainder of the sequence.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param count Number of elements to bypass. Values less than or equal to zero result in no elements being skipped.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the elements that remain after skipping {@link count} items.
 * @remarks Enumeration advances through the skipped prefix without yielding any of those elements.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const skipped = skip(numbers, 2).toArray();
 * console.log(skipped); // [3, 4, 5]
 * ```
 */
export const skip = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).skip(count);
};
