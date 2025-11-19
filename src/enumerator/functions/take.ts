import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Returns up to the specified number of leading elements from {@link source}.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param count Number of elements to emit; values less than or equal to zero produce an empty sequence.
 * @returns {IEnumerable<TElement>} A deferred sequence containing at most {@link count} elements from the start of {@link source}.
 * @remarks Enumeration stops once {@link count} elements have been yielded or the source sequence ends.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const firstTwo = take(numbers, 2).toArray();
 * console.log(firstTwo); // [1, 2]
 *
 * const emptyTake = take(numbers, 0).toArray();
 * console.log(emptyTake); // []
 * ```
 */
export const take = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).take(count);
};
