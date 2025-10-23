import { KeyValuePair } from "../../dictionary/KeyValuePair";
import { EqualityComparator } from "../../shared/EqualityComparator";
import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Counts the occurrences of elements grouped by a derived key.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type produced by `keySelector`.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the grouping key for each element.
 * @param comparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<KeyValuePair<TKey, number>>} A sequence of key/count pairs describing how many elements share each key.
 * @remarks Each key appears exactly once in the result with its associated occurrence count.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const countByCategory = countBy(products, p => p.category).toArray();
 * console.log(countByCategory);
 * // [
 * //   { key: 'Fruit', value: 2 },
 * //   { key: 'Vegetable', value: 1 }
 * // ]
 * ```
 */
export const countBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<KeyValuePair<TKey, number>> => {
    return from(source).countBy(keySelector, comparator);
};
