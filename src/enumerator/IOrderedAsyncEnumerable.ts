import { IAsyncEnumerable } from "../imports";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export interface IOrderedAsyncEnumerable<TElement> extends IAsyncEnumerable<TElement> {
    /**
     * Performs a subsequent ordering of the elements in a sequence in ascending order according to a key.
     * @param keySelector A function to extract a key from an element.
     * @param comparator A function to compare keys.
     */
    thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;

    /**
     * Performs a subsequent ordering of the elements in a sequence in descending order according to a key.
     * @param keySelector A function to extract a key from an element.
     * @param comparator A function to compare keys.
     */
    thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;
}
