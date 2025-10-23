import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Inserts the specified separator between adjoining elements.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSeparator Type of separator to insert.
 * @param source The source iterable.
 * @param separator Value inserted between consecutive elements.
 * @returns {IEnumerable<TElement | TSeparator>} A sequence containing the original elements with separators interleaved.
 * @remarks No separator precedes the first element or follows the last element.
 * @example
 * ```typescript
 * const letters = ['a', 'b', 'c'];
 * const interspersed = intersperse(letters, '-').toArray();
 * console.log(interspersed); // ['a', '-', 'b', '-', 'c']
 * ```
 */
export const intersperse = <TElement, TSeparator>(
    source: Iterable<TElement>,
    separator: TSeparator
): IEnumerable<TElement | TSeparator> => {
    return from(source).intersperse(separator);
};
