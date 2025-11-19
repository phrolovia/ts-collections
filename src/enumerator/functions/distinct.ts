import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Eliminates duplicate elements from the sequence using an optional comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields each distinct element once.
 * @remarks Elements are compared by value; provide a comparator for custom reference types.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1, 4, 5, 5];
 * const distinctNumbers = distinct(numbers).toArray();
 * console.log(distinctNumbers); // [1, 2, 3, 4, 5]
 * ```
 */
export const distinct = <TElement>(
    source: Iterable<TElement>,
    keyComparator?: EqualityComparator<TElement>
): IEnumerable<TElement> => {
    return from(source).distinct(keyComparator);
};
