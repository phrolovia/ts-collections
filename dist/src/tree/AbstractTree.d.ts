import { ITree, TraverseType } from "./ITree";
import { INode } from "./INode";
export declare abstract class AbstractTree<T> implements ITree<T> {
    protected comparator: Function;
    protected root: INode<T>;
    protected constructor(comparator: Function);
    clear(): void;
    contains(item: T): boolean;
    private containsRecursive;
    private countTreeNodes;
    find(predicate: (item: T) => boolean): T;
    private findRecursive;
    forEach(action: (item: T) => void): void;
    private forEachRecursive;
    getRootData(): T;
    isEmpty(): boolean;
    remove(item: T): boolean;
    size(): number;
    toArray(): T[];
    private toArrayRecursive;
    protected toInorderArray(root: INode<T>, target: T[]): void;
    protected toPostorderArray(root: INode<T>, target: T[]): void;
    protected toPreorderArray(root: INode<T>, target: T[]): void;
    /**
     * Traverses the tree and applies the mapper function to each item.
     * @param  mapper The function that will be applied to each item.
     * @param  direction The direction of the traverse. (In-order, Pre-order, Post-order)
     * @return An array containing all the items of the tree. Order is defined by direction.
     */
    traverseAndMapToArray<R>(mapper: (item: T) => R, direction?: TraverseType): R[];
    /**
     * Traverses the tree and applies the morpher function to each item.
     * Returns a new tree with the morphed elements. Does not modify the original tree.
     * Pre-order traversing is used.
     * @param tree The tree that will be filled with the morphed items. This is normally an empty tree.
     * @param morpher The function that will be applied to each item.
     */
    traverseAndMorph<R>(tree: ITree<R>, morpher: (item: T) => R): ITree<R>;
    private traverseAndMorphRecursive;
    abstract add(item: T): boolean;
    abstract delete(item: T): void;
    abstract insert(item: T): void;
    abstract search(item: T): boolean;
}
