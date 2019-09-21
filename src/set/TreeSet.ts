import { ISet } from "./ISet";
import { BinarySearchTree } from "../tree/BinarySearchTree";

export class TreeSet<T> implements ISet<T> {
    private comparator: (v1: T, v2: T) => number = (v1: T|any, v2: T|any) => v1-v2;
    private tree: BinarySearchTree<T>;
    public constructor(comparator?: (v1: T, v2: T) => number) {
        if (comparator) this.comparator = comparator;
        this.tree = new BinarySearchTree<T>(this.comparator);
    }
    public add(item: T): boolean {
        if (this.tree.search(item)) return false;
        this.tree.insert(item);
        return true;
    }
    public clear(): void {
        this.tree.clear();
    }
    public contains(item: T): boolean {
        return this.tree.contains(item);
    }
    public isEmpty(): boolean {
        return this.tree.isEmpty();
    }
    public remove(item: T): boolean {
        return this.tree.remove(item);
    }
    public size(): number {
        return this.tree.size();
    }
    public toArray(): T[] {
        return this.tree.toArray();
    }
}