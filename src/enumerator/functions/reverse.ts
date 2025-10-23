import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Returns a deferred sequence that yields the source elements in reverse order.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @returns {IEnumerable<TElement>} A sequence that produces the elements of {@link source} in reverse iteration order.
 * @remarks The implementation materialises the entire sequence into an array before emitting elements, so avoid using it on infinite sequences or when memory usage is a concern.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const reversed = reverse(numbers).toArray();
 * console.log(reversed); // [5, 4, 3, 2, 1]
 * ```
 */
export const reverse = <TElement>(source: Iterable<TElement>): IEnumerable<TElement> => {
    return from(source).reverse();
};
