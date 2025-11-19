import { Enumerable } from "../Enumerable";
import { IEnumerable } from "../IEnumerable";

/**
 * Wraps an iterable with the library's `IEnumerable` implementation.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The iterable to expose as an enumerable sequence.
 * @returns {IEnumerable<TElement>} An enumerable view over the given iterable.
 * @remarks The returned sequence defers enumeration of {@link source} until iterated.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const enumerable = from(numbers);
 * console.log(enumerable.toArray()); // [1, 2, 3]
 * ```
 */
export const from = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return Enumerable.from(source);
};
