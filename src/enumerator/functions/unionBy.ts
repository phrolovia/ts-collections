import type { EqualityComparator } from "../../shared/EqualityComparator";
import type { Selector } from "../../shared/Selector";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Creates a set-style union between {@link source} and {@link other} by comparing keys projected from each element.
 * @template TElement Type of elements contained by the input sequences.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The initial sequence whose distinct elements lead the union.
 * @param other Additional sequence whose elements are appended after {@link source} when forming the union.
 * @param keySelector Projection that produces a comparison key for each element.
 * @param comparator Optional equality comparator that determines whether two keys are considered the same. Defaults to the library's standard equality comparator.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the distinct elements from {@link source} followed by elements from {@link other} whose keys were not previously observed.
 * @throws {unknown} Re-throws any error thrown while iterating either sequence or executing {@link keySelector} or {@link comparator}.
 * @remarks Keys are buffered to ensure uniqueness while elements remain lazily produced. Provide {@link comparator} when keys require structural equality semantics.
 * @example
 * ```typescript
 * const products1 = [
 *   { name: 'Apple', category: 'Fruit' },
 *   { name: 'Banana', category: 'Fruit' },
 * ];
 * const products2 = [
 *   { name: 'Carrot', category: 'Vegetable' },
 *   { name: 'Apple', category: 'Fruit' },
 * ];
 *
 * const unioned = unionBy(products1, products2, p => p.category).toArray();
 * console.log(unioned);
 * // [
 * //   { name: 'Apple', category: 'Fruit' },
 * //   { name: 'Banana', category: 'Fruit' },
 * //   { name: 'Carrot', category: 'Vegetable' }
 * // ]
 * ```
 */
export const unionBy = <TElement, TKey>(
    source: Iterable<TElement>,
    other: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: EqualityComparator<TKey>
): IEnumerable<TElement> => {
    return from(source).unionBy(other, keySelector, comparator);
};
