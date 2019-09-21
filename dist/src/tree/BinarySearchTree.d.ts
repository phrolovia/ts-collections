import { AbstractTree } from "./AbstractTree";
export declare class BinarySearchTree<T> extends AbstractTree<T> {
    constructor(comparator: Function);
    /**
     * Removes an item from the tree.
     * @param item The item to be removed from tree.
     */
    delete(item: T): void;
    private deleteNode;
    private findReplaceItem;
    private fixDoubleBlack;
    private fixRedRed;
    private getSuccessor;
    /**
     * Inserts an item to the tree.
     * @param item Item to be inserted.
     */
    insert(item: T): void;
    private leftRotate;
    private rightRotate;
    search(item: T): boolean;
    private searchNode;
    private swapColors;
    private swapValues;
}
