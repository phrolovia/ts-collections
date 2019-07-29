import { ICollection } from "../core/ICollection";
import { IEnumerable } from "../enumerator/IEnumerable";

export interface IList<T> extends ICollection<T>/*, IEnumerable<T>*/ {
    get(index: number): T;
    indexOf(item: T): number;
    insert(index: number, item: T): void;
    removeAt(index: number): void;
    set(index: number, item: T): void;
}