import type { IEnumerable } from "../IEnumerable";
import { InvalidArgumentException } from "../../shared/InvalidArgumentException";
import { Enumerator, List } from "../Enumerator";

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
    if (size < 1) {
        throw new InvalidArgumentException("Size must be greater than 0.", "size");
    }
    return new Enumerator(() => chunkGenerator(source, size));
};

function* chunkGenerator<TElement>(source: Iterable<TElement>, size: number): IterableIterator<IEnumerable<TElement>> {
    const iterator = source[Symbol.iterator]();
    let next = iterator.next();
    while (!next.done) {
        const chunk = new List<TElement>();
        for (let index = 0; index < size; ++index) {
            if (next.done) {
                break;
            }
            chunk.add(next.value);
            next = iterator.next();
        }
        yield chunk;
    }
}
