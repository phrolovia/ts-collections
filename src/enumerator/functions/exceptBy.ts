import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { OrderComparator } from "../../shared/OrderComparator";
import type { Selector } from "../../shared/Selector";
import type { IEnumerable } from "../IEnumerable";
import { Comparators } from "../../shared/Comparators";
import { Enumerator, createSortedKeys } from "../Enumerator";
import { KeySet } from "../helpers/keySetHelpers";

/**
 * Returns the elements of {@link source} whose projected keys are not present in {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type produced by `keySelector`.
 * @param source The source iterable.
 * @param other Sequence whose elements define the keys that should be excluded.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence that contains the elements from {@link source} whose keys are absent from {@link other}.
 * @remarks Source ordering is preserved and duplicate elements with distinct keys remain. {@link other} is fully enumerated to materialise the exclusion keys. With the default comparator the keys are hashed, so the operation takes linear time, and an order comparator keeps them in a sorted set. Any other equality comparator has to be checked against every key kept so far, which is quadratic when there are many distinct keys: for large inputs, prefer projecting a key that the default comparator can match.
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
    keyComparator ??= Comparators.equalityComparator;
    return new Enumerator(() => exceptByGenerator(source, other, keySelector, keyComparator));
};

function* exceptByGenerator<TElement, TKey>(source: Iterable<TElement>, iterable: Iterable<TElement>, keySelector: Selector<TElement, TKey>, keyComparator: EqualityComparator<TKey> | OrderComparator<TKey>): IterableIterator<TElement> {
    const keys = new KeySet<TKey>(keyComparator, createSortedKeys);
    for (const item of iterable) {
        keys.add(keySelector(item));
    }
    for (const item of source) {
        if (keys.add(keySelector(item))) {
            yield item;
        }
    }
}
