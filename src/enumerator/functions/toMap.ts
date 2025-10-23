import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Materialises {@link source} into a `Map` keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @returns {Map<TKey, TValue>} A map populated with the projected key/value pairs.
 * @remarks The entire sequence is enumerated immediately. When {@link keySelector} produces duplicate keys, later elements overwrite earlier entries.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const map = toMap(people, p => p.id, p => p.name);
 * console.log(map.get(1)); // 'Alice'
 * console.log(map.get(2)); // 'Bob'
 * ```
 */
export const toMap = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Map<TKey, TValue> => {
    return from(source).toMap(keySelector, valueSelector);
};
