import type { List } from "../../list/List";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a resizable list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {List<TElement>} A list containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const list = toList(numbers);
 * console.log(list.toArray()); // [1, 2, 3]
 * ```
 */
export const toList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): List<TElement> => {
    return from(source).toList(comparator);
};
