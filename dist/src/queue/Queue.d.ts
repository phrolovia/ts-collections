import { ICollection } from "../core/ICollection";
export declare class Queue<T> implements ICollection<T>, IterableIterator<T> {
    private count;
    private data;
    private iteratorIndex;
    constructor(data?: T[]);
    clear(): void;
    contains(item: T): boolean;
    dequeue(): T;
    enqueue(item: T): void;
    isEmpty(): boolean;
    peek(): T;
    toArray(): T[];
    next(): IteratorResult<T>;
    [Symbol.iterator](): IterableIterator<T>;
    readonly Count: number;
}
