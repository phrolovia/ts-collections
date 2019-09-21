import { IQueue } from "./IQueue";

export interface IDeque<T> extends IQueue<T> {
    dequeueLast(): T;
    enqueueFirst(item: T): void;
    peekLast(): T;
    pollLast(): T;
}