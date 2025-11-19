import type { OrderComparator } from "../../shared/OrderComparator";
import type { Selector } from "../../shared/Selector";
import { from } from "./from";
import type { IOrderedEnumerable } from "../IOrderedEnumerable";

/**
 * Sorts the elements of a sequence in ascending order by using a specified comparer.
 * @template TElement
 * @param source The source iterable.
 * @param keySelector The key selector function that will be used for selecting the key for an element.
 * @param comparator The comparator function that will be used for comparing two keys. If not specified, the default order comparison will be used.
 * @returns {IOrderedEnumerable<TElement>} A new enumerable sequence whose elements are sorted in ascending order.
 * @example
 * ```typescript
 * const people = [
 *   { name: 'Bob', age: 30 },
 *   { name: 'Alice', age: 25 },
 *   { name: 'Charlie', age: 22 },
 * ];
 * const sorted = orderBy(people, p => p.age).toArray();
 * console.log(sorted);
 * // [
 * //   { name: 'Charlie', age: 22 },
 * //   { name: 'Alice', age: 25 },
 * //   { name: 'Bob', age: 30 }
 * // ]
 * ```
 */
export const orderBy = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector: Selector<TElement, TKey>,
    comparator?: OrderComparator<TKey>
): IOrderedEnumerable<TElement> => {
    return from(source).orderBy(keySelector, comparator);
};
