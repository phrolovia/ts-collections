import {IEnumerable} from "./IEnumerable";

export interface IOrderedEnumerable<T> extends IEnumerable<T>{
    thenBy<K>(keySelector: (item: T) => K, comparator?: (item1: K, item2: K) => number): IOrderedEnumerable<T>;
    thenByDescending<K>(keySelector: (item: T) => K, comparator?: (item1: K, item2: K) => number): IOrderedEnumerable<T>;
}
