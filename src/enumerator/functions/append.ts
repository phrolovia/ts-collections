import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Creates a sequence that yields the current elements followed by the supplied element.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param element Element appended to the end of the sequence.
 * @returns {IEnumerable<TElement>} A new enumerable whose final item is the provided element.
 * @remarks The source sequence is not modified; enumeration is deferred until the returned sequence is iterated.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const appended = append(numbers, 4).toArray();
 * console.log(appended); // [1, 2, 3, 4]
 * ```
 */
export const append = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).append(element);
};
