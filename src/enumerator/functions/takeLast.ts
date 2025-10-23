import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Returns up to the specified number of trailing elements from {@link source}.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param count Number of elements to keep from the end; values less than or equal to zero produce an empty sequence.
 * @returns {IEnumerable<TElement>} A deferred sequence containing at most {@link count} elements from the end of {@link source}.
 * @remarks The implementation buffers up to {@link count} elements to determine the tail, so memory usage grows with {@link count}. The source must be finite.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const lastTwo = takeLast(numbers, 2).toArray();
 * console.log(lastTwo); // [4, 5]
 *
 * const emptyTakeLast = takeLast(numbers, 0).toArray();
 * console.log(emptyTakeLast); // []
 * ```
 */
export const takeLast = <TElement>(
    source: Iterable<TElement>,
    count: number
): IEnumerable<TElement> => {
    return from(source).takeLast(count);
};
