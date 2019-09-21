import { AbstractTree } from "./AbstractTree";
import { TreeNode } from "./TreeNode";
export class BinaryTree<T> extends AbstractTree<T> {
    public constructor(comparator: Function) {
        super(comparator);
        this.root = null;
    }
    public delete(item: T): void {
        this.root = this.deleteRecursive(this.root as TreeNode<T>, item);
    }
    private deleteRecursive(root: TreeNode<T>, item: T): TreeNode<T> {
        if (root == null) return null;
        if (this.comparator(item, root.getData()) === 0) {
            if (root.getLeft() == null && root.getRight() == null) {
                return null;
            }
            if (root.getRight() == null) {
                return root.getLeft() as TreeNode<T>;
            }
            if (root.getLeft() == null) {
                return root.getRight() as TreeNode<T>;
            }
            const smallestValue = this.findSmallestValue(root.getRight() as TreeNode<T>);
            root.setData(smallestValue);
            root.setRight(this.deleteRecursive(root.getRight() as TreeNode<T>, smallestValue));
            return root;
        }
        if (this.comparator(item, root.getData()) < 0) {
            root.setLeft(this.deleteRecursive(root.getLeft() as TreeNode<T>, item));
            return root;
        }
        root.setRight(this.deleteRecursive(root.getRight() as TreeNode<T>, item));
        return root;
    }
    private findSmallestValue(root: TreeNode<T>): T {
        return root.getLeft() == null ? root.getData() : this.findSmallestValue(root.getLeft() as TreeNode<T>);
    }
    public insert(item: T): void {
        this.root = this.insertRecursive(this.root as TreeNode<T>, item);
    }
    private insertRecursive(root: TreeNode<T>, item: T): TreeNode<T> {
        if (root == null) return new TreeNode<T>(item);
        if (this.comparator(item, root.getData()) < 0) {
            root.setLeft(this.insertRecursive(root.getLeft() as TreeNode<T>, item));
        } else if (this.comparator(item, root.getData()) > 0) {
            root.setRight(this.insertRecursive(root.getRight() as TreeNode<T>, item));
        } else {
            return root;
        }
        return root;
    }
    public search(item: T): boolean {
       return this.searchTree(this.root as TreeNode<T>, item);
    }
    private searchTree(root: TreeNode<T>, item: T): boolean {
        if (this.comparator(item, root.getData()) === 0) return true;
        if (root.getLeft() != null) {
            if (this.searchTree(root.getLeft() as TreeNode<T>, item)) return true;
        }
        if (root.getRight() != null) {
            if (this.searchTree(root.getRight() as TreeNode<T>, item)) return true;
        }
        return false;
    }
    
    
}