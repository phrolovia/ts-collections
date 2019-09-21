import { ICollection } from "../core/ICollection";

export interface IQueue<T> extends ICollection<T> {
    element(): T;
    offer(item: T): boolean;
    peek(): T;
    poll(): T;
    remove(): T;
}