import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Creates a set-style union between {@link source} and {@link other} using an equality comparator.
 * @template TElement Type of elements contained by the input sequences.
 * @param source The initial sequence whose distinct elements lead the union.
 * @param other Additional sequence whose elements are appended after {@link source} when forming the union.
 * @param comparator Optional equality comparator that determines whether two elements are considered the same. Defaults to the library's standard equality comparator.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the distinct elements from {@link source} followed by elements from {@link other} that are not already present according to {@link comparator}.
 * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link comparator}.
 * @remarks Elements yielded by {@link source} always appear before contributions from {@link other}. Only comparison data required to detect duplicates is buffered, and each input is enumerated at most once.
 * @example
 * ```typescript
 * const numbers1 = [1, 2, 3, 4, 5];
 * const numbers2 = [3, 5, 6, 7];
 * const unioned = union(numbers1, numbers2).toArray();
 * console.log(unioned); // [1, 2, 3, 4, 5, 6, 7]
 * ```
 */
export const union = <TElement>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).union(other, comparator);
};
