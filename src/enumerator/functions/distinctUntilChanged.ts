import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Removes consecutive duplicate elements by comparing each element with its predecessor.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used to determine whether adjacent elements are equal. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields the first element of each run of equal values.
 * @remarks Unlike {@link distinct}, this only filters adjacent duplicates and preserves earlier occurrences of repeated values.
 * @example
 * ```typescript
 * const numbers = [1, 1, 2, 2, 2, 1, 3, 3];
 * const distinctUntilChangedNumbers = distinctUntilChanged(numbers).toArray();
 * console.log(distinctUntilChangedNumbers); // [1, 2, 1, 3]
 * ```
 */
export const distinctUntilChanged = <TElement>(source: Iterable<TElement>, comparator?: EqualityComparator<TElement>): IEnumerable<TElement> => {
    return from(source).distinctUntilChanged(comparator);
};
