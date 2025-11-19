import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";
import type { IGroup } from "../IGroup";

/**
 * Partitions the sequence into groups based on keys projected from each element.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the grouping key for each element.
 * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<IGroup<TKey, TElement>>} A sequence of groups, each exposing the key and the elements that share it.
 * @remarks The source sequence is enumerated once when the result is iterated. Elements within each group preserve their original order, and group contents are cached for repeated enumeration.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 *
 * const grouped = groupBy(products, p => p.category);
 * for (const group of grouped) {
 *   console.log(group.key, group.toArray());
 * }
 * // Fruit [ { name: 'Apple', category: 'Fruit' }, { name: 'Banana', category: 'Fruit' } ]
 * // Vegetable [ { name: 'Carrot', category: 'Vegetable' } ]
 * ```
 */
export const groupBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<IGroup<TKey, TElement>> => {
    return from(source).groupBy(keySelector, keyComparator);
};
