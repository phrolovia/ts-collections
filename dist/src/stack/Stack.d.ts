export declare class Stack<T> {
    private count;
    private data;
    constructor(data: T[]);
    clear(): void;
    contains(item: T): boolean;
    peek(): T;
    pop(): T;
    push(item: T): void;
    toArray(): T[];
    readonly Count: number;
}
