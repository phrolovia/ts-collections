import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Returns the elements of {@link source} that are not present in {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Sequence whose elements should be removed from {@link source}.
 * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the elements from {@link source} that do not appear in {@link other}.
 * @remarks The original ordering and duplicate occurrences from {@link source} are preserved. {@link other} is fully enumerated to build the exclusion set.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3, 4, 5];
 * const numbers2 = [3, 5, 7];
 * const result = except(numbers1, numbers2).toArray();
 * console.log(result); // [1, 2, 4]
 * ```
 */
export const except = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).except(other, comparator);
};
