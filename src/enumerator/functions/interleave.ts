import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";

/**
 * Interleaves the sequence with another iterable, yielding elements in alternating order.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements in the second iterable.
 * @param source The source iterable.
 * @param other Iterable whose elements are alternated with the current sequence.
 * @returns {IEnumerable<TElement | TSecond>} A sequence that alternates between elements from {@link source} and {@link other}.
 * @remarks If one sequence is longer, the remaining elements are appended after the shorter sequence is exhausted. Enumeration is deferred.
 * @example
 * ```typescript
 * const numbers1 = [1, 3, 5];
 * const numbers2 = [2, 4, 6];
 * const interleaved = interleave(numbers1, numbers2).toArray();
 * console.log(interleaved); // [1, 2, 3, 4, 5, 6]
 * ```
 */
export const interleave = <TElement, TSecond>(source: Iterable<TElement>, other: Iterable<TSecond>): IEnumerable<TElement | TSecond> => {
    return new Enumerator(() => interleaveGenerator(source, other));
};

function* interleaveGenerator<TElement, TSecond>(source: Iterable<TElement>, other: Iterable<TSecond>): IterableIterator<TElement | TSecond> {
    const sourceIterator = source[Symbol.iterator]();
    const otherIterator = other[Symbol.iterator]();
    let e1 = sourceIterator.next();
    let e2 = otherIterator.next();
    while (!e1.done || !e2.done) {
        if (!e1.done) {
            yield e1.value;
            e1 = sourceIterator.next();
        }
        if (!e2.done) {
            yield e2.value;
            e2 = otherIterator.next();
        }
    }
}
