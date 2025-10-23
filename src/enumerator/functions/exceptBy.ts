import { EqualityComparator } from "../../shared/EqualityComparator";
import { OrderComparator } from "../../shared/OrderComparator";
import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Returns the elements of {@link source} whose projected keys are not present in {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type produced by `keySelector`.
 * @param source The source iterable.
 * @param other Sequence whose elements define the keys that should be excluded.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence that contains the elements from {@link source} whose keys are absent from {@link other}.
 * @remarks Source ordering is preserved and duplicate elements with distinct keys remain. {@link other} is fully enumerated to materialise the exclusion keys.
 * @example
 * ```typescript
 * const products1 = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 * const products2 = [
 *   { name: 'Broccoli', category: 'Vegetable' },
 * ];
 *
 * const result = exceptBy(products1, products2, p => p.category).toArray();
 * console.log(result);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Banana', category: 'Fruit' }
 * // ]
 * ```
 */
export const exceptBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).exceptBy(other, keySelector, keyComparator);
};
