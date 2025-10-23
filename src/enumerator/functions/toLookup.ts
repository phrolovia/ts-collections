import { ILookup } from "../../lookup/ILookup";
import { OrderComparator } from "../../shared/OrderComparator";
import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Materialises {@link source} into a lookup keyed by the provided selector.
 * @template TElement Type of elements within {@link source}.
 * @template TKey Type of key returned by {@link keySelector}.
 * @template TValue Type of value returned by {@link valueSelector}.
 * @param source The source iterable.
 * @param keySelector Selector used to derive the key for each element.
 * @param valueSelector Selector used to derive the value for each element.
 * @param keyComparator Optional order comparator used to compare keys in the resulting lookup.
 * @returns {ILookup<TKey, TValue>} A lookup grouping the projected values by key.
 * @remarks The entire sequence is enumerated immediately. Elements within each group preserve their original order and the groups are cached for repeated enumeration.
 * @example
 * ```typescript
 * const products = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 * const lookup = toLookup(products, p => p.category, p => p.name);
 * console.log(lookup.get('Fruit').toArray()); // ['Apple', 'Banana']
 * console.log(lookup.get('Vegetable').toArray()); // ['Carrot']
 * ```
 */
export const toLookup = <TElement, TKey, TValue>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    valueSelector: Selector<TElement, TValue>,
    keyComparator?: OrderComparator<TKey>
): ILookup<TKey, TValue> => {
    return from(source).toLookup(keySelector, valueSelector, keyComparator);
};
