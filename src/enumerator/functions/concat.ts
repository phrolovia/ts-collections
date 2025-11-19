import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Appends the specified iterable to the end of the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Additional elements that are yielded after the current sequence.
 * @returns {IEnumerable<TElement>} A sequence containing the elements of the current sequence followed by those from `other`.
 * @remarks Enumeration of both sequences is deferred until the result is iterated.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3];
 * const numbers2 = [4, 5, 6];
 * const concatenated = concat(numbers1, numbers2).toArray();
 * console.log(concatenated); // [1, 2, 3, 4, 5, 6]
 * ```
 */
export const concat = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>
): IEnumerable<TElement> => {
    return from(source).concat(from(other));
};
