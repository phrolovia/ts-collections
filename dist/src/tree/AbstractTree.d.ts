import { ITree, TraverseType } from "./ITree";
import { INode } from "./INode";
import { Constructor } from "../core/Constructor";
import { ICollection } from "../core/ICollection";
import { AbstractCollection } from "../core/AbstractCollection";
export declare abstract class AbstractTree<T> extends AbstractCollection<T> implements ITree<T> {
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
    transform<U extends ICollection<T>>(Collection: Constructor<U>, comparator?: (v1: T, v2: T) => number): U;
    private transformRecursive;
    /**
     * Traverses the tree and applies the mapper function to each item.
     * @param  mapper The function that will be applied to each item.
     * @param  direction The direction of the traverse. (In-order, Pre-order, Post-order)
     * @return An array containing all the items of the tree. Order is defined by direction.
     */
    traverseAndMapToArray<R>(mapper: (item: T) => R, direction?: TraverseType): R[];
    abstract add(item: T): boolean;
    abstract delete(item: T): void;
    abstract insert(item: T): void;
    abstract search(item: T): boolean;
}
