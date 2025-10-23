import { SortedSet } from "../../set/SortedSet";
import { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a sorted set of distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to sort the elements.
 * @returns {SortedSet<TElement>} A sorted set containing the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's ordering semantics.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const sortedSet = toSortedSet(numbers);
 * console.log(sortedSet.toArray()); // [1, 2, 3, 4, 5, 6, 9]
 * ```
 */
export const toSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): SortedSet<TElement> => {
    return from(source).toSortedSet(comparator);
};
