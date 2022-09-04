import {IAsyncEnumerable} from "../../imports";
import {Selector} from "../shared/Selector";
import {OrderComparator} from "../shared/OrderComparator";

export interface IOrderedAsyncEnumerable<TElement> extends IAsyncEnumerable<TElement> {
    thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;
    thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedAsyncEnumerable<TElement>;
}
