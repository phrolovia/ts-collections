export declare class Stack<T> implements IterableIterator<T> {
    private count;
    private data;
    private iteratorIndex;
    constructor(data?: T[]);
    clear(): void;
    contains(item: T): boolean;
    peek(): T;
    pop(): T;
    push(item: T): void;
    toArray(): T[];
    next(): IteratorResult<T>;
    [Symbol.iterator](): IterableIterator<T>;
    readonly Count: number;
}
