export declare class Queue<T> implements IterableIterator<T> {
    private count;
    private data;
    private iteratorIndex;
    constructor(data?: T[]);
    clear(): void;
    contains(item: T): boolean;
    dequeue(): T;
    enqueue(item: T): void;
    peek(): T;
    toArray(): T[];
    next(): IteratorResult<T>;
    [Symbol.iterator](): IterableIterator<T>;
    readonly Count: number;
}
