import { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";
import { IOrderedEnumerable } from "../IOrderedEnumerable";

/**
 * Sorts the elements of the sequence in descending order using the provided comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements. Defaults to the library's standard order comparison when omitted.
 * @returns {IOrderedEnumerable<TElement>} An ordered sequence sorted descending.
 * @remarks Sorting is deferred; the sequence is ordered only when iterated. Use `thenBy`/`thenByDescending` on the returned sequence to specify secondary keys.
 * @example
 * ```typescript
 * const numbers = [3, 1, 5, 2, 4];
 * const sorted = orderDescending(numbers).toArray();
 * console.log(sorted); // [5, 4, 3, 2, 1]
 * ```
 */
export const orderDescending = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): IOrderedEnumerable<TElement> => {
    return from(source).orderDescending(comparator);
};
