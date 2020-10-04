import {ISet} from "../set/ISet";
import {IList} from "../list/IList";

export interface IDictionary<K, V> {
    clear(): void;
    get(key: K): V;
    isEmpty(): boolean;
    keys(): ISet<K>;
    put(key: K, value: V): V;
    remove(key: K): V;
    size(): number;
    values(): IList<V>;
}
