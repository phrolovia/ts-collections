import { EqualityComparator } from "../../shared/EqualityComparator";
import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Eliminates duplicate elements by comparing keys computed for each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Key type returned by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to project each element to the key used for distinctness.
 * @param keyComparator Optional equality comparator used to compare keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TElement>} A sequence that contains the first occurrence of each unique key.
 * @remarks Each element's key is evaluated exactly once; cache expensive key computations when possible.
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
    return from(source).distinctBy(keySelector, keyComparator);
};
