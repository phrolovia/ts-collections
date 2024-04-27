import { IEnumerable } from "../imports.ts";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export interface IOrderedEnumerable<TElement> extends IEnumerable<TElement> {

    /**
     * Performs a subsequent ordering on the elements of an IOrderedEnumerable<T> in ascending order according to a key.
     * @param keySelector A function to extract a key from an element.
     * @param comparator A function to compare keys.
     */
    thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;

    /**
     * Performs a subsequent ordering on the elements of an IOrderedEnumerable<T> in descending order according to a key.
     * @param keySelector A function to extract a key from an element.
     * @param comparator A function to compare keys.
     */
    thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
}
