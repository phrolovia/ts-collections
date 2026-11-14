import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";

/**
 * Enumerates the sequence while exposing the zero-based index alongside each element.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<[number, TElement]>} A sequence of `[index, element]` tuples.
 * @remarks The index is assigned in the order elements are produced. Enumeration is deferred until the result is iterated.
 * @example
 * ```typescript
 * const letters = ['a', 'b', 'c'];
 * const indexed = index(letters).toArray();
 * console.log(indexed); // [[0, 'a'], [1, 'b'], [2, 'c']]
 * ```
 */
export const index = <TElement>(source: Iterable<TElement>): IEnumerable<[number, TElement]> => {
    return new Enumerator<[number, TElement]>(() => indexGenerator(source));
};

function* indexGenerator<TElement>(source: Iterable<TElement>): IterableIterator<[number, TElement]> {
    let index = 0;
    for (const item of source) {
        yield [index++, item];
    }
}
