import { ITree, TraverseType } from "./ITree";
import { INode } from "./INode";

export abstract class AbstractTree<T> implements ITree<T> {
    protected comparator: Function = null;
    protected root: INode<T>;
    protected constructor(comparator: Function) {
        this.comparator = comparator;
    }
    public clear(): void {
        this.root = null;
    }
    public contains(item: T): boolean {
        return this.containsRecursive(this.root, item);
    }
    private containsRecursive(root: INode<T>, item: T): boolean {
        if (root == null) return false;
        if (this.comparator(item, root.getData()) === 0) return true;
        return this.comparator(item, root.getData()) < 0
            ? this.containsRecursive(root.getLeft(), item)
            : this.containsRecursive(root.getRight(), item);
    }
    private countTreeNodes(root: INode<T>): number {
        if (root == null) return 0;
        return 1 + this.countTreeNodes(root.getLeft()) + this.countTreeNodes(root.getRight());
    }
    public find(predicate: (item: T) => boolean): T {
        if (this.root == null) return null;
        return this.findRecursive(<INode<T>>this.root, predicate);
    }
    private findRecursive(root: INode<T>, predicate: (item: T) => boolean): T {
        if (root == null) return null;
        if (predicate(root.getData())) return root.getData();
        let foundItem: T = this.findRecursive(root.getLeft(), predicate);
        if (foundItem != null){
            return foundItem;
        }
        return this.findRecursive(root.getRight(), predicate);
    }
    public forEach(action: (item: T) => void): void {
        if (this.root == null) return;
        this.forEachRecursive(this.root, action);
    }
    private forEachRecursive(root: INode<T>, action: (item: T) => void): void {
        if (root == null) return;
        this.forEachRecursive(root.getLeft(), action);
        action(root.getData());
        this.forEachRecursive(root.getRight(), action);
    }
    public getRootData(): T {
        return this.root.getData();
    }
    public isEmpty(): boolean {
        return this.root == null;
    }
    public remove(item: T): boolean {
        if(!this.contains(item)) return false;
        this.delete(item);
        return true;
    }
    public size(): number {
        return this.countTreeNodes(this.root);
    }
    public toArray(): T[] {
        const target: T[] = [];
        if (this.isEmpty()) return target;
        this.toArrayRecursive(<INode<T>>this.root, target);
        return target;
    }
    private toArrayRecursive(root: INode<T>, target: T[]): void {
        if (root == null) return;
        this.toArrayRecursive(root.getLeft(), target);
        target.push(root.getData());
        this.toArrayRecursive(root.getRight(), target);
    }
    protected toInorderArray(root: INode<T>, target: T[]) {
        if (root == null) return;
        this.toInorderArray(root.getLeft(), target);
        target.push(root.getData());
        this.toInorderArray(root.getRight(), target);
    }
    protected toPostorderArray(root: INode<T>, target: T[]) {
        if (root == null) return;
        this.toPostorderArray(root.getLeft(), target);
        this.toPostorderArray(root.getRight(), target);
        target.push(root.getData());
    }
    protected toPreorderArray(root: INode<T>, target: T[]) {
        if (root == null) return;
        target.push(root.getData());
        this.toPreorderArray(root.getLeft(), target);
        this.toPreorderArray(root.getRight(), target);
    }
    
    /**
     * Traverses the tree and applies the mapper function to each item.
     * @param  mapper The function that will be applied to each item.
     * @param  direction The direction of the traverse. (In-order, Pre-order, Post-order)
     * @return An array containing all the items of the tree. Order is defined by direction.
     */
    public traverseAndMapToArray<R>(mapper: (item: T) => R, direction: TraverseType = "INORDER"): R[] {
        let array: T[] = [];
        switch(direction) {
            case "INORDER":
                this.toInorderArray(this.root, array);
                break;
            case "PREORDER":
                this.toPreorderArray(this.root, array);
                break;
            case "POSTORDER":
                this.toPostorderArray(this.root, array);
                break;
        }
        return array.map(v => mapper(v));
    }
    /**
     * Traverses the tree and applies the morpher function to each item.
     * Returns a new tree with the morphed elements. Does not modify the original tree.
     * Pre-order traversing is used.
     * @param tree The tree that will be filled with the morphed items. This is normally an empty tree.
     * @param morpher The function that will be applied to each item.
     */
    public traverseAndMorph<R>(tree: ITree<R>, morpher: (item: T) => R): ITree<R> {
        this.traverseAndMorphRecursive(this.root, morpher, tree);
        return tree;
    }
    private traverseAndMorphRecursive<R>(root: INode<T>, morpher: (item: T) => R, tree: ITree<R>): void {
        if (root == null) return;
        tree.insert(morpher(root.getData()));
        this.traverseAndMorphRecursive(root.getLeft(), morpher, tree);
        this.traverseAndMorphRecursive(root.getRight(), morpher, tree);
    }

    public abstract add(item: T): boolean;
    public abstract delete(item: T): void;
    public abstract insert(item: T): void;
    // public abstract remove(item: T): boolean;
    public abstract search(item: T): boolean;
}