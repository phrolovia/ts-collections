import type { Dictionary } from "../../dictionary/Dictionary";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Materialises {@link source} into a dictionary keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param valueComparator Optional equality comparator used by the resulting dictionary to compare values.
 * @returns {Dictionary<TKey, TValue>} A dictionary populated with the projected key/value pairs.
 * @throws {InvalidArgumentException} Thrown when {@link keySelector} produces duplicate keys.
 * @remarks The entire sequence is enumerated immediately and entries are inserted in iteration order.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const dictionary = toDictionary(people, p => p.id, p => p.name);
 * console.log(dictionary.get(1)); // 'Alice'
 * console.log(dictionary.get(2)); // 'Bob'
 * ```
 */
export const toDictionary = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    valueComparator?: EqualityComparator<TValue>
): Dictionary<TKey, TValue> => {
    return from(source).toDictionary(keySelector, valueSelector, valueComparator);
};
