import { ICollection } from "../core/ICollection";
export declare class Stack<T> implements ICollection<T> {
    private count;
    private data;
    constructor(data?: T[]);
    clear(): void;
    contains(item: T): boolean;
    isEmpty(): boolean;
    peek(): T;
    pop(): T;
    push(item: T): void;
    toArray(): T[];
    readonly Count: number;
}
