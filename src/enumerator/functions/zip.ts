import type { Zipper } from "../../shared/Zipper";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Combines {@link source} with {@link other} and optionally projects each aligned pair using {@link zipper}.
 * @template TElement Type of elements within {@link source}.
 * @template TSecond Type of elements within {@link other}.
 * @template TResult Result type produced by {@link zipper}; defaults to `[TElement, TSecond]` when {@link zipper} is omitted.
 * @param source The primary sequence whose elements lead each pair.
 * @param other The secondary sequence whose elements are paired with {@link source}.
 * @param zipper Optional projection invoked with each `[source, other]` pair. When omitted, the tuples `[source, other]` are emitted.
 * @returns {IEnumerable<TResult>} A deferred sequence of projected results truncated to the length of the shorter input.
 * @throws {unknown} Re-throws any error thrown while iterating either input sequence or executing {@link zipper}.
 * @remarks Enumeration is lazy; pairs are produced on demand and iteration stops as soon as either input completes.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const letters = ['a', 'b', 'c'];
 * const zipped = zip(numbers, letters).toArray();
 * console.log(zipped); // [[1, 'a'], [2, 'b'], [3, 'c']]
 *
 * const zippedWithSelector = zip(numbers, letters, (num, letter) => `${num}-${letter}`).toArray();
 * console.log(zippedWithSelector); // ['1-a', '2-b', '3-c']
 * ```
 */
export const zip = <TElement, TSecond, TResult = [TElement, TSecond]>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    zipper?: Zipper<TElement, TSecond, TResult>
): IEnumerable<[TElement, TSecond]> | IEnumerable<TResult> => {
    if (zipper) {
        return from(source).zip(other, zipper);
    } else {
        return from(source).zip(other);
    }
};
