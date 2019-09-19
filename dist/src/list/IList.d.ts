import { ICollection } from "../core/ICollection";
export interface IList<T> extends ICollection<T> {
    add(item: T): void;
    get(index: number): T;
    indexOf(item: T): number;
    insert(index: number, item: T): void;
    removeAt(index: number): void;
    set(index: number, item: T): void;
}
