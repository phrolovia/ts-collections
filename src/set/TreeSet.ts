import { ISet } from "./ISet";
import { BinarySearchTree } from "../tree/BinarySearchTree";

export class TreeSet<T> implements ISet<T> {
    private tree: BinarySearchTree<T>;
    public constructor(comparator?: (v1: T, v2: T) => number) {
        this.tree = new BinarySearchTree<T>(comparator);
    }
    public add(item: T): boolean {
        if (this.tree.search(item)) return false;
        this.tree.insert(item);
        return true;
    }
    public clear(): void {
        this.tree.clear();
    }
    public includes(item: T): boolean {
        return this.tree.includes(item);
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
    public get Count(): number {
        return this.tree.size();
    }
    *[Symbol.iterator](): Iterator<T> {
        for (const item of this.tree) {
            yield item;
        }
    }
}
