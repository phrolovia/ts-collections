import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import { Comparators } from "../../shared/Comparators";
import { groupBy } from "./groupBy";
import { KeyValuePair } from "../../dictionary/KeyValuePair";
import { select } from "./select";
import { count } from "./count";

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
    return select(groupBy(source, keySelector, comparator ?? Comparators.equalityComparator), group => new KeyValuePair(group.key, count(group.source)));
};
