import { ICollection } from "../core/ICollection";
export declare class Stack<T> implements ICollection<T> {
    private data;
    constructor(data?: T[]);
    add(item: T): boolean;
    clear(): void;
    contains(item: T): boolean;
    isEmpty(): boolean;
    peek(): T;
    pop(): T;
    push(item: T): void;
    remove(item: T): boolean;
    size(): number;
    toArray(): T[];
}
