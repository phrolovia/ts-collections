import type { SortedDictionary } from "../../dictionary/SortedDictionary";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { OrderComparator } from "../../shared/OrderComparator";
import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Materialises {@link source} into a sorted dictionary keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param keyComparator Optional order comparator used to sort keys in the resulting dictionary.
 * @param valueComparator Optional equality comparator used to compare values in the resulting dictionary.
 * @returns {SortedDictionary<TKey, TValue>} A sorted dictionary populated with the projected key/value pairs.
 * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const people = [
 *   { id: 2, name: 'Bob' },
 *   { id: 1, name: 'Alice' },
 * ];
 * const sortedDictionary = toSortedDictionary(people, p => p.id, p => p.name);
 * console.log(sortedDictionary.keys().toArray()); // [1, 2]
 * console.log(sortedDictionary.get(1)); // 'Alice'
 * ```
 */
export const toSortedDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>,
    valueComparator?: EqualityComparator<TValue>
): SortedDictionary<TKey, TValue> => {
    return from(source).toSortedDictionary(keySelector, valueSelector, keyComparator, valueComparator);
};
