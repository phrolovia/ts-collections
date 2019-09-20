import { ITree } from "./ITree";
import { INode } from "./INode";
declare class RedBlackNode<T> implements INode<T> {
    static readonly RED = 0;
    static readonly BLACK = 1;
    private data;
    private left;
    private parent;
    private right;
    private color;
    constructor(data: T);
    getData(): T;
    getColor(): number;
    getLeft(): RedBlackNode<T>;
    getParent(): RedBlackNode<T>;
    getRight(): RedBlackNode<T>;
    getSibling(): RedBlackNode<T>;
    getUncle(): RedBlackNode<T>;
    hasRedChild(): boolean;
    isOnLeft(): boolean;
    moveDown(p: RedBlackNode<T>): void;
    setColor(color: number): void;
    setData(data: T): void;
    setLeft(left: RedBlackNode<T>): void;
    setParent(parent: RedBlackNode<T>): void;
    setRight(right: RedBlackNode<T>): void;
}
export declare class BinarySearchTree<T> implements ITree<T> {
    private root;
    private comparator;
    constructor(comparator?: Function);
    clear(): void;
    contains(item: T): boolean;
    private containsRecursive;
    /**
     * Returns the number of nodes in the tree.
     */
    private countTreeNodes;
    /**
     * Removes an item from the tree.
     * @param item The item to be removed from tree.
     */
    delete(item: T): void;
    private deleteNode;
    find(predicate: (item: T) => boolean): T;
    private findRecursive;
    private findReplaceItem;
    private fixDoubleBlack;
    private fixRedRed;
    forEach(action: (item: T) => void): void;
    private forEachRecursive;
    getNodeCount(): number;
    /**
     * Returns the root node of the tree.
     */
    getRoot(): RedBlackNode<T>;
    getRootData(): T;
    private getSuccessor;
    /**
     * Inserts an item to the tree.
     * @param item Item to be inserted.
     */
    insert(item: T): void;
    /**
     * Checks whether the tree is empty or not.
     */
    isEmpty(): boolean;
    private leftRotate;
    private rightRotate;
    /**
     * Searchs an item in the tree.
     * Returns the node the item belongs to,
     * or null if item does not exists in tree.
     */
    search(item: T): boolean;
    private searchNode;
    private swapColors;
    private swapValues;
    /**
     * Maps the tree data into an array inorderly.
     */
    toArray(): T[];
    private toArrayRecursive;
}
export {};
