import type { EnumerableSet } from "../../set/EnumerableSet";
import { from } from "./from";

/**
 * Materialises {@link source} into an enumerable set containing the distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {EnumerableSet<TElement>} A set populated with the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's equality semantics.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1];
 * const set = toEnumerableSet(numbers);
 * console.log(set.toArray()); // [1, 2, 3]
 * ```
 */
export const toEnumerableSet = <TElement>(
    source: Iterable<TElement>
): EnumerableSet<TElement> => {
    return from(source).toEnumerableSet();
};
