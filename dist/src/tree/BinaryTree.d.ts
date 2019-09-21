import { AbstractTree } from "./AbstractTree";
export declare class BinaryTree<T> extends AbstractTree<T> {
    constructor(comparator: Function);
    add(item: T): boolean;
    delete(item: T): void;
    private deleteRecursive;
    private findSmallestValue;
    insert(item: T): void;
    private insertRecursive;
    search(item: T): boolean;
    private searchTree;
}
