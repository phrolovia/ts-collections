import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";

/**
 * Supplies fallback content when the sequence contains no elements.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param value Optional value returned in a singleton sequence when the source is empty. Defaults to `null`.
 * @returns {IEnumerable<TElement | null>} The original sequence when it has elements; otherwise, a singleton sequence containing the provided value.
 * @remarks Use this to ensure downstream operators always receive at least one element.
 * @example
 * ```typescript
 * const empty = [];
 * const withDefault = defaultIfEmpty(empty, 0).toArray();
 * console.log(withDefault); // [0]
 *
 * const numbers = [1, 2, 3];
 * const withDefault2 = defaultIfEmpty(numbers, 0).toArray();
 * console.log(withDefault2); // [1, 2, 3]
 * ```
 */
export const defaultIfEmpty = <TElement>(
    source: Iterable<TElement>,
    value?: TElement | null
): IEnumerable<TElement | null> => {
    return new Enumerator(() => defaultIfEmptyGenerator(source, value));
};

function* defaultIfEmptyGenerator<TElement>(source: Iterable<TElement>, value?: TElement | null): IterableIterator<TElement | null> {
    const iterator = source[Symbol.iterator]();
    const first = iterator.next();
    if (!first.done) {
        yield first.value;
        yield* iterator as IterableIterator<TElement>;
    } else {
        yield value ?? null;
    }
}
