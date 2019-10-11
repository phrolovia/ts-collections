import { AbstractTree } from "./AbstractTree";
import { TreeNode } from "./TreeNode";

// Algorithm taken from https://www.geeksforgeeks.org/red-black-tree-set-3-delete-2/
class RedBlackNode<T> extends TreeNode<T> {
    public static readonly RED   = 0;
    public static readonly BLACK = 1;
    private parent: RedBlackNode<T>;
    private color: number;
    public constructor(data: T) {
        super(data);
        this.setLeft(null);
        this.setRight(null);
        this.parent = null;
        this.color = RedBlackNode.RED;
    }
    public getColor(): number { return this.color; }
    public getParent(): RedBlackNode<T> { return this.parent; }
    public getSibling(): RedBlackNode<T> {
        if (this.parent == null) return null;
        if (this.isOnLeft()) return this.parent.getRight() as RedBlackNode<T>;
        return this.parent.getLeft() as RedBlackNode<T>;
    }
    public getUncle(): RedBlackNode<T> {
        if (this.parent == null || this.parent.getParent() == null){
            return null;
        }
        if (this.parent.isOnLeft()){
            return this.parent.getParent().getRight() as RedBlackNode<T>;
        }
        return this.parent.getParent().getLeft() as RedBlackNode<T>;
    }
    public hasRedChild(): boolean {
        return (this.getLeft() != null && (this.getLeft() as RedBlackNode<T>).getColor() === RedBlackNode.RED)
            || (this.getRight() != null && (this.getRight() as RedBlackNode<T>).getColor() === RedBlackNode.RED);
    }
    public isOnLeft(): boolean {
        return this.parent.getLeft() === this;
    }
    public moveDown(p: RedBlackNode<T>): void { //p: parentnode
        if (this.parent != null) {
            if (this.isOnLeft()) {
                this.parent.setLeft(p);
            } else {
                this.parent.setRight(p);
            }
        }
        p.setParent(this.parent);
        this.parent = p;
    }
    public setColor(color: number): void { this.color = color; }
    public setParent(parent: RedBlackNode<T>): void { this.parent = parent; }
}

export class BinarySearchTree<T> extends AbstractTree<T> {
    public constructor(comparator: Function){
        super(comparator);
        this.root = null;
    }
    public add(item: T): boolean {
        if(this.search(item)) return false;
        this.insert(item);
        return true;
    }
    /**
     * Removes an item from the tree.
     * @param item The item to be removed from tree.
     */
    public delete(item: T): void {
        if (!this.contains(item)) return;
        let v: RedBlackNode<T> = this.searchNode(item);
        this.deleteNode(v);
    }
    private deleteNode(v: RedBlackNode<T>): void {
        let u: RedBlackNode<T> = this.findReplaceItem(v);
        const bothBlack = ((u == null || u.getColor() === RedBlackNode.BLACK) && v.getColor() === RedBlackNode.BLACK);
        let parent: RedBlackNode<T> = v.getParent();
        if (u === null) {
            if (v === this.root) {
                this.root = null;
            } else {
                if (bothBlack) {
                    this.fixDoubleBlack(v);
                } else {
                    if (v.getSibling() != null) {
                        v.getSibling().setColor(RedBlackNode.RED);
                    }
                }
                if (v.isOnLeft()) {
                    parent.setLeft(null);
                } else {
                    parent.setRight(null);
                }
            }
            return;
        }
        if (v.getLeft() == null || v.getRight() == null) {
            if (v === this.root) {
                v.setData(u.getData());
                v.setLeft(null);
                v.setRight(null);
            } else {
                if (v.isOnLeft()) {
                    parent.setLeft(u);
                } else {
                    parent.setRight(u);
                }
                u.setParent(parent);
                if (bothBlack) {
                    this.fixDoubleBlack(u);
                } else {
                    u.setColor(RedBlackNode.BLACK);
                }
            }
            return;
        }
        this.swapValues(u, v);
        this.deleteNode(u);
    }
    private findReplaceItem(node: RedBlackNode<T>): RedBlackNode<T> {
        if (node.getLeft() != null && node.getRight() != null) {
            return this.getSuccessor(node.getRight() as RedBlackNode<T>);
        }
        if (node.getLeft() == null && node.getRight() == null) {
            return null;
        }
        if (node.getLeft() != null){
            return node.getLeft() as RedBlackNode<T>;
        }
        return node.getRight() as RedBlackNode<T>;
    }
    private fixDoubleBlack(node: RedBlackNode<T>): void {
        if (node === this.root) return;
        let sibling = node.getSibling();
        let parent  = node.getParent();
        if (sibling == null) {
            this.fixDoubleBlack(parent);
        } else {
            if (sibling.getColor() === RedBlackNode.RED) {
                parent.setColor(RedBlackNode.RED);
                sibling.setColor(RedBlackNode.BLACK);
                if (sibling.isOnLeft()) {
                    this.rightRotate(parent);
                } else {
                    this.leftRotate(parent);
                }
                this.fixDoubleBlack(node);
            } else {
                if (sibling.hasRedChild()) {
                    if ((sibling.getLeft() as RedBlackNode<T>) != null && (sibling.getLeft() as RedBlackNode<T>).getColor() === RedBlackNode.RED) {
                        if (sibling.isOnLeft()) {
                            (sibling.getLeft() as RedBlackNode<T>).setColor(sibling.getColor());
                            sibling.setColor(parent.getColor());
                            this.rightRotate(parent);
                        } else {
                            (sibling.getLeft() as RedBlackNode<T>).setColor(parent.getColor());
                            this.rightRotate(sibling);
                            this.leftRotate(parent);
                        }
                    } else {
                        if (sibling.isOnLeft()) {
                            (sibling.getRight() as RedBlackNode<T>).setColor(parent.getColor());
                            this.leftRotate(sibling);
                            this.rightRotate(parent);
                        } else {
                            (sibling.getRight() as RedBlackNode<T>).setColor(sibling.getColor());
                            sibling.setColor(parent.getColor());
                            this.leftRotate(parent);
                        }
                    }
                    parent.setColor(RedBlackNode.BLACK);
                } else {
                    sibling.setColor(RedBlackNode.RED);
                    if (parent.getColor() === RedBlackNode.BLACK) {
                        this.fixDoubleBlack(parent);
                    } else {
                        parent.setColor(RedBlackNode.BLACK);
                    }
                }
            }
        }
    }
    private fixDoubleRed(node: RedBlackNode<T>): void {
        if (node === this.root){
            node.setColor(RedBlackNode.BLACK);
            return;
        }
        let parent: RedBlackNode<T> = node.getParent();
        let grandParent: RedBlackNode<T> = parent.getParent();
        let uncle: RedBlackNode<T> = node.getUncle();
        if (parent.getColor() !== RedBlackNode.BLACK){
            if (uncle != null && uncle.getColor() === RedBlackNode.RED) {
                parent.setColor(RedBlackNode.BLACK);
                uncle.setColor(RedBlackNode.BLACK);
                grandParent.setColor(RedBlackNode.RED);
                this.fixDoubleRed(grandParent);
            } else {
                if (parent.isOnLeft()) {
                    if (node.isOnLeft()) {
                        this.swapColors(parent, grandParent);
                    } else {
                        this.leftRotate(parent);
                        this.swapColors(node, grandParent);
                    }
                    this.rightRotate(grandParent);
                } else {
                    if (node.isOnLeft()) {
                        this.rightRotate(parent);
                        this.swapColors(node, grandParent);
                    } else {
                        this.swapColors(parent, grandParent);
                    }
                    this.leftRotate(grandParent);
                }
            }
        }
    }
    private getSuccessor(node: RedBlackNode<T>): RedBlackNode<T> {
        let temp = node;
        while (temp.getLeft() != null){
            temp = temp.getLeft() as RedBlackNode<T>;
        }
        return temp;
    }
    /**
     * Inserts an item to the tree.
     * @param item Item to be inserted.
     */
    public insert(item: T): void {
        const node = new RedBlackNode<T>(item);
        if (this.root == null) {
            node.setColor(RedBlackNode.BLACK);
            this.root = node;
        } else {
            const temp: RedBlackNode<T> = this.searchNode(item);
            if (temp.getData() === item) {
                return;
            }
            node.setParent(temp);
            if (this.comparator(item, temp.getData()) < 0) {
                temp.setLeft(node);
            } else {
                temp.setRight(node);
            }
            this.fixDoubleRed(node);
        }
    }
    private leftRotate(node: RedBlackNode<T>): void {
        let p = node.getRight();
        if (node === this.root) {
            this.root = p;
        }
        node.moveDown(p as RedBlackNode<T>);
        node.setRight(p.getLeft() as RedBlackNode<T>);
        if (p.getLeft() != null) {
            (p.getLeft() as RedBlackNode<T>).setParent(node);
        }
        p.setLeft(node);
    }
    private rightRotate(node: RedBlackNode<T>): void {
        let p = node.getLeft();
        if (node === this.root){
            this.root = p;
        }
        node.moveDown(p as RedBlackNode<T>);
        node.setLeft(p.getRight());
        if (p.getRight() != null) {
            (p.getRight() as RedBlackNode<T>).setParent(node);
        }
        p.setRight(node);
    }
    public search(item: T): boolean {
        const node = this.searchNode(item);
        if (node == null) return false;
        return this.comparator(node.getData(), item) === 0;
    }
    private searchNode(item: T): RedBlackNode<T> {
        let temp: RedBlackNode<T> = this.root as RedBlackNode<T>;
        while (temp != null) {
            if (this.comparator(item, temp.getData()) < 0) {
                if (temp.getLeft() == null) {
                    break;
                } else {
                    temp = temp.getLeft() as RedBlackNode<T>;
                }
            } else if (item === temp.getData()) {
                break;
            } else {
                if (temp.getRight() == null) {
                    break;
                } else {
                    temp = temp.getRight() as RedBlackNode<T>;
                }
            }
        }
        return temp;
    }
    private swapColors(u: RedBlackNode<T>, v: RedBlackNode<T>): void {
        let temp = u.getColor();
        u.setColor(v.getColor());
        v.setColor(temp);
    }
    private swapValues(u: RedBlackNode<T>, v: RedBlackNode<T>): void {
        let temp = u.getData();
        u.setData(v.getData());
        v.setData(temp);
    }
}