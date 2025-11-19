import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Splits the sequence into contiguous subsequences containing at most the specified number of elements.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Maximum number of elements to include in each chunk. Must be greater than 0.
 * @returns {IEnumerable<IEnumerable<TElement>>} A sequence where each element is a chunk of the original sequence.
 * @throws {InvalidArgumentException} Thrown when `size` is less than 1.
 * @remarks The final chunk may contain fewer elements than `size`. Enumeration is deferred until the returned sequence is iterated.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
 * const chunks = chunk(numbers, 3);
 * console.log(chunks.select(c => c.toArray()).toArray()); // [[1, 2, 3], [4, 5, 6], [7, 8]]
 * ```
 */
export const chunk = <TElement>(
    source: Iterable<TElement>,
    size: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).chunk(size);
};
