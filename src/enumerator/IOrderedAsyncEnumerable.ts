import { IAsyncEnumerable } from "../imports";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export interface IOrderedAsyncEnumerable<TElement> extends IAsyncEnumerable<TElement> {
    thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;

    thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;
}
