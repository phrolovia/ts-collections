import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { IEnumerable } from "../IEnumerable";
import { unionBy } from "./unionBy";

/**
 * Eliminates duplicate elements from the sequence using an optional comparator.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param keyComparator Optional equality comparator used to determine whether two elements are identical. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that yields each distinct element once.
 * @remarks Elements are compared by value; provide a comparator for custom reference types. With the default comparator the keys are hashed, so the operation takes linear time, and an order comparator keeps them in a sorted set. Any other equality comparator has to be checked against every key kept so far, which is quadratic when there are many distinct keys: for large inputs, prefer projecting a key that the default comparator can match with {@link distinctBy}.
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
    return unionBy(source, [], element => element, keyComparator);
};
