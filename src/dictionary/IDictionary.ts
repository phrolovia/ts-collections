import {ISet} from "../set/ISet";
import {IList} from "../list/IList";
import {EqualityComparator} from "../shared/EqualityComparator";

export interface IDictionary<K, V> {
    add(key: K, value: V): V;
    clear(): void;
    containsKey(key: K, comparator?: EqualityComparator<K>): boolean;
    containsValue(value: V, comparator?: EqualityComparator<V>): boolean;
    get(key: K): V;
    isEmpty(): boolean;
    keys(): ISet<K>;
    remove(key: K): V;
    size(): number;
    tryAdd(key: K, value: V): boolean;
    values(): IList<V>;
}
