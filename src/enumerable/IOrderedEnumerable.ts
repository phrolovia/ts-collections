import {IEnumerable} from "./IEnumerable";
import {Selector} from "../shared/Selector";
import {Comparator} from "../shared/Comparator";

export interface IOrderedEnumerable<T> extends IEnumerable<T> {
    thenBy<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T>;
    thenByDescending<K>(keySelector: Selector<T, K>, comparator?: Comparator<K>): IOrderedEnumerable<T>;
}
