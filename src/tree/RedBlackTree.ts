import {AbstractTree} from "../imports.ts";
import {Predicate} from "../shared/Predicate";
import {OrderComparator} from "../shared/OrderComparator";
import {TreeNode} from "./TreeNode";

// Algorithm taken from https://www.geeksforgeeks.org/red-black-tree-set-3-delete-2/
class RedBlackNode<TElement> extends TreeNode<TElement> {
    public static readonly RED = 0;
    public static readonly BLACK = 1;
    private parent: RedBlackNode<TElement> | null;
    private color: number;

    public constructor(data: TElement) {
        super(data);
        this.setLeft(null);
        this.setRight(null);
        this.parent = null;
        this.color = RedBlackNode.RED;
    }

    public getColor(): number {
        return this.color;
    }

    public getParent(): RedBlackNode<TElement> | null {
        return this.parent;
    }

    public getSibling(): RedBlackNode<TElement> | null {
        if (this.parent == null) return null;
        if (this.isOnLeft()) return this.parent.getRight() as RedBlackNode<TElement>;
        return this.parent.getLeft() as RedBlackNode<TElement>;
    }

    public getUncle(): RedBlackNode<TElement> | null {
        if (this.parent == null || this.parent.getParent() == null) {
            return null;
        }
        if (this.parent.isOnLeft()) {
            return this.parent.getParent()?.getRight() as RedBlackNode<TElement>;
        }
        return this.parent.getParent()?.getLeft() as RedBlackNode<TElement>;
    }

    public hasRedChild(): boolean {
        return (this.getLeft() != null && (this.getLeft() as RedBlackNode<TElement>).getColor() === RedBlackNode.RED)
            || (this.getRight() != null && (this.getRight() as RedBlackNode<TElement>).getColor() === RedBlackNode.RED);
    }

    public isOnLeft(): boolean {
        return this.parent?.getLeft() === this;
    }

    public moveDown(p: RedBlackNode<TElement>): void { //p: parent node
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

    public setColor(color: number): void {
        this.color = color;
    }

    public setParent(parent: RedBlackNode<TElement> | null): void {
        this.parent = parent;
    }
}

export class RedBlackTree<TElement> extends AbstractTree<TElement> {
    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator?: OrderComparator<TElement>,
    ) {
        super(comparator);
        for (const element of iterable) {
            this.add(element);
        }
        this.updateLength();
    }

    public add(element: TElement): boolean {
        if (this.search(element)) {
            return false;
        }
        this.insert(element);
        return true;
    }

    public delete(element: TElement): void {
        if (!this.contains(element)) {
            return;
        }
        const node = this.searchNode(element);
        this.deleteNode(node);
        this.treeSize--;
        this.updateLength();
    }

    public insert(element: TElement): void {
        const node = new RedBlackNode<TElement>(element);
        if (this.root == null) {
            node.setColor(RedBlackNode.BLACK);
            this.root = node;
        } else {
            const temp: RedBlackNode<TElement> = this.searchNode(element);
            if (this.orderComparator(temp.getData(), element) === 0) {
                return;
            }
            node.setParent(temp);
            if (this.orderComparator(element, temp.getData()) < 0) {
                temp.setLeft(node);
            } else {
                temp.setRight(node);
            }
            this.fixDoubleRed(node);
        }
        this.treeSize++;
        this.updateLength();
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const oldSize = this.size();
        for (const element of collection) {
            this.delete(element);
        }
        return this.size() !== oldSize;
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        const oldSize = this.size();
        const elementsToRemove: TElement[] = [];
        for (const element of this) {
            if (predicate(element)) {
                elementsToRemove.push(element);
            }
        }
        elementsToRemove.forEach(e => this.delete(e));
        return this.size() !== oldSize;
    }

    public search(element: TElement): boolean {
        const node = this.searchNode(element);
        if (node == null) {
            return false;
        }
        return this.comparer(node.getData(), element);
    }

    private deleteNode(v: RedBlackNode<TElement>): void {
        let u: RedBlackNode<TElement> | null = this.findReplaceItem(v);
        const bothBlack = ((u == null || u.getColor() === RedBlackNode.BLACK) && v.getColor() === RedBlackNode.BLACK);
        let parent: RedBlackNode<TElement> | null = v.getParent();
        if (u === null) {
            if (v === this.root) {
                this.root = null;
            } else {
                if (bothBlack) {
                    this.fixDoubleBlack(v);
                } else {
                    if (v.getSibling() != null) {
                        v.getSibling()?.setColor(RedBlackNode.RED);
                    }
                }
                if (v.isOnLeft()) {
                    parent?.setLeft(null);
                } else {
                    parent?.setRight(null);
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
                    parent?.setLeft(u);
                } else {
                    parent?.setRight(u);
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

    private findReplaceItem(node: RedBlackNode<TElement>): RedBlackNode<TElement> | null {
        if (node.getLeft() != null && node.getRight() != null) {
            return this.getSuccessor(node.getRight() as RedBlackNode<TElement>);
        }
        if (node.getLeft() == null && node.getRight() == null) {
            return null;
        }
        if (node.getLeft() != null) {
            return node.getLeft() as RedBlackNode<TElement>;
        }
        return node.getRight() as RedBlackNode<TElement>;
    }

    private fixDoubleBlack(node: RedBlackNode<TElement> | null): void {
        if (node == null || node === this.root) return;
        let sibling = node.getSibling();
        let parent = node.getParent() as RedBlackNode<TElement>;
        if (sibling == null) {
            this.fixDoubleBlack(parent);
        } else {
            if (sibling.getColor() === RedBlackNode.RED) {
                parent?.setColor(RedBlackNode.RED);
                sibling.setColor(RedBlackNode.BLACK);
                if (sibling.isOnLeft()) {
                    this.rightRotate(parent);
                } else {
                    this.leftRotate(parent);
                }
                this.fixDoubleBlack(node);
            } else {
                if (sibling.hasRedChild()) {
                    if ((sibling.getLeft() as RedBlackNode<TElement>) != null && (sibling.getLeft() as RedBlackNode<TElement>).getColor() === RedBlackNode.RED) {
                        if (sibling.isOnLeft()) {
                            (sibling.getLeft() as RedBlackNode<TElement>).setColor(sibling.getColor());
                            sibling.setColor(parent.getColor());
                            this.rightRotate(parent);
                        } else {
                            (sibling.getLeft() as RedBlackNode<TElement>).setColor(parent.getColor());
                            this.rightRotate(sibling);
                            this.leftRotate(parent);
                        }
                    } else {
                        if (sibling.isOnLeft()) {
                            (sibling.getRight() as RedBlackNode<TElement>).setColor(parent.getColor());
                            this.leftRotate(sibling);
                            this.rightRotate(parent);
                        } else {
                            (sibling.getRight() as RedBlackNode<TElement>).setColor(sibling.getColor());
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

    private fixDoubleRed(node: RedBlackNode<TElement>): void {
        if (node === this.root) {
            node.setColor(RedBlackNode.BLACK);
            return;
        }
        let parent: RedBlackNode<TElement> = node.getParent() as RedBlackNode<TElement>;
        let grandParent: RedBlackNode<TElement> = parent.getParent() as RedBlackNode<TElement>;
        let uncle: RedBlackNode<TElement> | null = node.getUncle();
        if (parent.getColor() !== RedBlackNode.BLACK) {
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

    private getSuccessor(node: RedBlackNode<TElement>): RedBlackNode<TElement> {
        let temp = node;
        while (temp.getLeft() != null) {
            temp = temp.getLeft() as RedBlackNode<TElement>;
        }
        return temp;
    }

    private leftRotate(node: RedBlackNode<TElement>): void {
        let p = node.getRight() as RedBlackNode<TElement>;
        if (node === this.root) {
            this.root = p;
        }
        node.moveDown(p);
        node.setRight(p.getLeft() as RedBlackNode<TElement>);
        if (p.getLeft() != null) {
            (p.getLeft() as RedBlackNode<TElement>).setParent(node);
        }
        p.setLeft(node);
    }

    private rightRotate(node: RedBlackNode<TElement>): void {
        let p = node.getLeft() as RedBlackNode<TElement>;
        if (node === this.root) {
            this.root = p;
        }
        node.moveDown(p as RedBlackNode<TElement>);
        node.setLeft(p.getRight());
        if (p.getRight() != null) {
            (p.getRight() as RedBlackNode<TElement>).setParent(node);
        }
        p.setRight(node);
    }

    private searchNode(element: TElement): RedBlackNode<TElement> {
        let temp: RedBlackNode<TElement> = this.root as RedBlackNode<TElement>;
        while (temp != null) {
            if (this.orderComparator(element, temp.getData()) < 0) {
                if (temp.getLeft() == null) {
                    break;
                } else {
                    temp = temp.getLeft() as RedBlackNode<TElement>;
                }
            } else if (this.comparer(element, temp.getData())) {
                break;
            } else {
                if (temp.getRight() == null) {
                    break;
                } else {
                    temp = temp.getRight() as RedBlackNode<TElement>;
                }
            }
        }
        return temp;
    }

    private swapColors(u: RedBlackNode<TElement>, v: RedBlackNode<TElement>): void {
        let temp = u.getColor();
        u.setColor(v.getColor());
        v.setColor(temp);
    }

    private swapValues(u: RedBlackNode<TElement>, v: RedBlackNode<TElement>): void {
        let temp = u.getData();
        u.setData(v.getData());
        v.setData(temp);
    }
}
