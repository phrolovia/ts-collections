import { EqualityComparator } from "../../shared/EqualityComparator";
import { JoinSelector } from "../../shared/JoinSelector";
import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Correlates each element of the sequence with a collection of matching elements from another sequence.
 * @template TElement Type of elements within the outer sequence.
 * @template TInner Type of elements within the inner sequence.
 * @template TKey Type of key produced by the key selectors.
 * @template TResult Type of element returned by {@link resultSelector}.
 * @param source The outer sequence.
 * @param innerEnumerable Sequence whose elements are grouped and joined with the outer elements.
 * @param outerKeySelector Selector that extracts the join key from each outer element.
 * @param innerKeySelector Selector that extracts the join key from each inner element.
 * @param resultSelector Projection that combines an outer element with an `IEnumerable` of matching inner elements.
 * @param keyComparator Optional equality comparator used to match keys. Defaults to the library's standard equality comparison.
 * @returns {IEnumerable<TResult>} A sequence produced by applying {@link resultSelector} to each outer element and its matching inner elements.
 * @remarks The inner sequence is enumerated once to build an in-memory lookup before outer elements are processed. Each outer element is then evaluated lazily and preserves the original outer ordering.
 * @example
 * ```typescript
 * const categories = [
 *   { id: 1, name: 'Fruit' },
 *   { id: 2, name: 'Vegetable' },
 * ];
 * const products = [
 *   { name: 'Apple', categoryId: 1 },
 *   { name: 'Banana', categoryId: 1 },
 *   { name: 'Carrot', categoryId: 2 },
 * ];
 *
 * const joined = groupJoin(
 *   categories,
 *   products,
 *   c => c.id,
 *   p => p.categoryId,
 *   (c, ps) => ({ ...c, products: ps.toArray() })
 * ).toArray();
 *
 * console.log(joined);
 * // [
 * //   { id: 1, name: 'Fruit', products: [ { name: 'Apple', categoryId: 1 }, { name: 'Banana', categoryId: 1 } ] },
 * //   { id: 2, name: 'Vegetable', products: [ { name: 'Carrot', categoryId: 2 } ] }
 * // ]
 * ```
 */
export const groupJoin = <TElement, TInner, TKey, TResult>(
    source: Iterable<TElement>,
    innerEnumerable: Iterable<TInner>,
    outerKeySelector: Selector<TElement, TKey>,
    innerKeySelector: Selector<TInner, TKey>,
    resultSelector: JoinSelector<TElement, IEnumerable<TInner>, TResult>,
    keyComparator?: EqualityComparator<TKey>
): IEnumerable<TResult> => {
    return from(source).groupJoin(from(innerEnumerable), outerKeySelector, innerKeySelector, resultSelector, keyComparator);
};
