import {IEnumerable} from "./IEnumerable";
import {Selector} from "../shared/Selector";
import {OrderComparator} from "../shared/OrderComparator";

export interface IOrderedEnumerable<TElement> extends IEnumerable<TElement> {
    thenBy<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
    thenByDescending<TKey>(keySelector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): IOrderedEnumerable<TElement>;
}
