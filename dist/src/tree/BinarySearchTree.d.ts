import { AbstractTree } from "./AbstractTree";
export declare class BinarySearchTree<T> extends AbstractTree<T> {
    constructor(comparator: Function);
    add(item: T): boolean;
    delete(item: T): void;
    private deleteNode;
    private findReplaceItem;
    private fixDoubleBlack;
    private fixDoubleRed;
    private getSuccessor;
    insert(item: T): void;
    private leftRotate;
    private rightRotate;
    search(item: T): boolean;
    private searchNode;
    private swapColors;
    private swapValues;
}
