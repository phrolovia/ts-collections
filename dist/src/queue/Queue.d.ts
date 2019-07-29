export declare class Queue<T> {
    private count;
    private data;
    constructor(data: T[]);
    clear(): void;
    contains(item: T): boolean;
    dequeue(): T;
    enqueue(item: T): void;
    peek(): T;
    toArray(): T[];
    readonly Count: number;
}
