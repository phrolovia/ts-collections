import { AbstractTree } from "./AbstractTree";
import { TreeNode } from "./TreeNode";
import {INode} from "./INode";
export class BinaryTree<T> extends AbstractTree<T> {
    public constructor(comparator?: (item1: T, item2: T) => number) {
        super(comparator);
        this.root = null;
    }
    public add(item: T): boolean {
        if(this.search(item)) return false;
        this.insert(item);
        return true;
    }
    public delete(item: T): void {
        this.root = this.deleteRecursive(this.root, item);
    }
    public insert(item: T): void {
        this.root = this.insertRecursive(this.root, item);
    }
    public search(item: T): boolean {
       return this.searchTree(this.root, item);
    }
    private deleteRecursive(root: INode<T>, item: T): INode<T> {
        if (root == null) return null;
        if (this.comparator(item, root.getData()) === 0) {
            if (root.getLeft() == null && root.getRight() == null) {
                return null;
            }
            if (root.getRight() == null) {
                return root.getLeft();
            }
            if (root.getLeft() == null) {
                return root.getRight();
            }
            const smallestValue = this.findSmallestValue(root.getRight());
            root.setData(smallestValue);
            root.setRight(this.deleteRecursive(root.getRight(), smallestValue));
            return root;
        }
        if (this.comparator(item, root.getData()) < 0) {
            root.setLeft(this.deleteRecursive(root.getLeft(), item));
            return root;
        }
        root.setRight(this.deleteRecursive(root.getRight(), item));
        return root;
    }
    private findSmallestValue(root: INode<T>): T {
        return root.getLeft() == null ? root.getData() : this.findSmallestValue(root.getLeft());
    }
    private insertRecursive(root: INode<T>, item: T): INode<T> {
        if (root == null) return new TreeNode<T>(item);
        if (this.comparator(item, root.getData()) < 0) {
            root.setLeft(this.insertRecursive(root.getLeft(), item));
        } else if (this.comparator(item, root.getData()) > 0) {
            root.setRight(this.insertRecursive(root.getRight(), item));
        } else {
            return root;
        }
        return root;
    }
    private searchTree(root: INode<T>, item: T): boolean {
        if (root == null) return false;
        if (this.comparator(item, root.getData()) === 0) return true;
        if (root.getLeft() != null) {
            if (this.searchTree(root.getLeft(), item)) return true;
        }
        if (root.getRight() != null) {
            if (this.searchTree(root.getRight(), item)) return true;
        }
        return false;
    }
}
