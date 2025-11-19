import type { ImmutableSortedSet } from "../../set/ImmutableSortedSet";
import type { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable sorted set of distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to sort the elements.
 * @returns {ImmutableSortedSet<TElement>} An immutable sorted set containing the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's ordering semantics.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const immutableSortedSet = toImmutableSortedSet(numbers);
 * console.log(immutableSortedSet.toArray()); // [1, 2, 3, 4, 5, 6, 9]
 * ```
 */
export const toImmutableSortedSet = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutableSortedSet<TElement> => {
    return from(source).toImmutableSortedSet(comparator);
};
