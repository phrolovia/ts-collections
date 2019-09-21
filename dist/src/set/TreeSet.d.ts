import { ISet } from "./ISet";
export declare class TreeSet<T> implements ISet<T> {
    private comparator;
    private tree;
    constructor(comparator?: (v1: T, v2: T) => number);
    add(item: T): boolean;
    clear(): void;
    contains(item: T): boolean;
    isEmpty(): boolean;
    remove(item: T): boolean;
    size(): number;
    toArray(): T[];
}
