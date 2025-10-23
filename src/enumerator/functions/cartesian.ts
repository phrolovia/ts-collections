import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Produces the cartesian product between {@link source} and {@link other}.
 * @template TElement Type of elements in the {@link source} iterable.
 * @template TSecond Type of elements in the {@link other} iterable.
 * @param source The primary iterable that drives the resulting sequence.
 * @param other The secondary iterable paired with every element from {@link source}.
 * @returns {IEnumerable<[TElement, TSecond]>} A deferred sequence that yields each ordered pair `[source, other]`.
 * @throws {unknown} Re-throws any error raised while iterating {@link source} or {@link other}.
 * @remarks The secondary iterable is fully buffered before iteration starts so that it can be replayed for every element from {@link source}. The resulting sequence stops when {@link source} completes.
 * @example
 * ```typescript
 * const pairs = cartesian([1, 2], ['A', 'B']).toArray();
 * console.log(pairs); // [[1, 'A'], [1, 'B'], [2, 'A'], [2, 'B']]
 * ```
 */
export const cartesian = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>
): IEnumerable<[TElement, TSecond]> => {
    return from(source).cartesian(other);
}
