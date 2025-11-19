import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Returns the elements common to {@link source} and {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param other Iterable whose elements are compared against {@link source}.
 * @param comparator Optional comparator used to determine element equality. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences.
 * @remarks The original ordering of {@link source} is preserved. {@link other} is fully enumerated to build the inclusion set prior to yielding results.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3, 4, 5];
 * const numbers2 = [3, 5, 7];
 * const result = intersect(numbers1, numbers2).toArray();
 * console.log(result); // [3, 5]
 * ```
 */
export const intersect = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement> | OrderComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).intersect(other, comparator);
};
