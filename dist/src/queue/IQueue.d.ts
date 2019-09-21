import { ICollection } from "../core/ICollection";
export interface IQueue<T> extends ICollection<T> {
    dequeue(): T;
    enqueue(item: T): void;
    peek(): T;
    poll(): T;
}
