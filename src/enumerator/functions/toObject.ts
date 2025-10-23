import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Materialises {@link source} into a plain object keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey extends PropertyKey Property key type returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the property key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @returns {Record<TKey, TValue>} An object populated with the projected key/value pairs.
 * @remarks The entire sequence is enumerated immediately. When {@link keySelector} produces duplicate keys, later values overwrite earlier ones.
 * @example
 * ```typescript
 * const people = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ];
 * const obj = toObject(people, p => p.id, p => p.name);
 * console.log(obj[1]); // 'Alice'
 * console.log(obj[2]); // 'Bob'
 * ```
 */
export const toObject = <TElement, TKey extends PropertyKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>
): Record<TKey, TValue> => {
    return from(source).toObject(keySelector, valueSelector);
};
