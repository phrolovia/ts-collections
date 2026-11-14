import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import { unionBy } from "./unionBy";

/**
 * Eliminates duplicate elements by comparing keys computed for each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Key type returned by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for distinctness.
 * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that contains the first occurrence of each unique key.
 * @remarks Each element's key is evaluated exactly once; cache expensive key computations when possible. With the default comparator the keys are hashed, so the operation takes linear time, and an order comparator keeps them in a sorted set. Any other equality comparator has to be checked against every key kept so far, which is quadratic when there are many distinct keys: for large inputs, prefer projecting a key that the default comparator can match.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const distinctByCategory = distinctBy(products, p => p.category).toArray();
 * console.log(distinctByCategory);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' }
 * // ]
 * ```
 */
export const distinctBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return unionBy(source, [], keySelector, keyComparator);
};
