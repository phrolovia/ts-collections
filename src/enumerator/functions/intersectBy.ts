import { EqualityComparator } from "../../shared/EqualityComparator";
import { OrderComparator } from "../../shared/OrderComparator";
import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Returns the elements whose keys are common to {@link source} and {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable.
 * @param other Iterable whose elements define the keys considered part of the intersection.
 * @param keySelector Selector used to project each element to the key used for comparison.
 * @param keyComparator Optional comparator used to compare keys. Both equality and order comparators are supported; defaults to the library's standard equality comparison when omitted.
 * @returns {IEnumerable<TElement>} A sequence containing the intersection of the two sequences based on matching keys.
 * @remarks {@link other} is fully enumerated to materialise the inclusion keys before yielding results. Source ordering is preserved.
 * @example
 * ```typescript
 * const products1 = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Carrot', category: 'Vegetable' },
 * ];
 * const products2 = [
 *   { name: 'Banana', category: 'Fruit' },
 *   { name: 'Broccoli', category: 'Vegetable' },
 * ];
 *
 * const result = intersectBy(products1, products2, p => p.category).toArray();
 * console.log(result);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' }
 * // ]
 * ```
 */
export const intersectBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    keyComparator?: EqualityComparator<TKey> | OrderComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).intersectBy(other, keySelector, keyComparator);
};
