import type { ImmutableList } from "../../list/ImmutableList";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {ImmutableList<TElement>} An immutable list containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableList = toImmutableList(numbers);
 * console.log(immutableList.toArray()); // [1, 2, 3]
 * ```
 */
export const toImmutableList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableList<TElement> => {
    return from(source).toImmutableList(comparator);
};
