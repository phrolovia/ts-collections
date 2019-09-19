// Algorithm taken from https://www.geeksforgeeks.org/red-black-tree-set-3-delete-2/
class RedBlackNode<T> {
    public static readonly RED   = 0;
    public static readonly BLACK = 1;
    private data: T;
    private left: RedBlackNode<T>;
    private parent: RedBlackNode<T>;
    private right: RedBlackNode<T>;
    private color: number;
    public constructor(data: T) {
        this.parent = this.left = this.right = null;
        this.color = RedBlackNode.RED;
        this.data  = data;
    }
    public getData(): T { return this.data; }
    public getColor(): number { return this.color; }
    public getLeft(): RedBlackNode<T> { return this.left; }
    public getParent(): RedBlackNode<T> { return this.parent; }
    public getRight(): RedBlackNode<T> { return this.right; }
    public getSibling(): RedBlackNode<T> {
        if (this.parent == null) return null;
        if (this.isOnLeft()) return this.parent.getRight();
        return this.parent.getLeft();
    }
    public getUncle(): RedBlackNode<T> {
        if (this.parent == null || this.parent.getParent() == null){
            return null;
        }
        if (this.parent.isOnLeft()){
            return this.parent.getParent().getRight();
        }
        return this.parent.getParent().getLeft();
    }
    public hasRedChild(): boolean {
        return (this.left != null && this.left.color === RedBlackNode.RED)
            || (this.right != null && this.right.color === RedBlackNode.RED);
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
    public setData(data: T): void { this.data = data; }
    public setLeft(left: RedBlackNode<T>): void { this.left = left; }
    public setParent(parent: RedBlackNode<T>): void { this.parent = parent; }
    public setRight(right: RedBlackNode<T>): void { this.right = right; }
}

export class BinarySearchTree<T> {
    private root: RedBlackNode<T>;
    private comparator: Function = (v1:T|any, v2:T|any) => v1 - v2;
    public constructor(comparator?: Function){
        if (comparator) this.comparator = comparator;
        this.root = null;
    }
    /**
     * Returns the number of nodes in the tree.
     */
    public countNodes(): number {
        return this.countTreeNodes(this.root);
    }
    private countTreeNodes(root: RedBlackNode<T>): number {
        if (root == null) return 0;
        return 1 + this.countTreeNodes(root.getLeft()) + this.countTreeNodes(root.getRight());
    }
    /**
     * Removes an item from the tree.
     * @param item The item to be removed from tree.
     */
    public delete(item: T): void {
        if (this.root == null) return;
        let v: RedBlackNode<T> = this.searchNode(item);
        if (v.getData() !== item) {
            return;
        }
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
            // v = null;
            return;
        }
        if (v.getLeft() == null || v.getRight() == null) {
            if (v === this.root) {
                v.setData(u.getData());
                v.setLeft(null);
                v.setRight(null);
                // u = null;
            } else {
                if (v.isOnLeft()) {
                    parent.setLeft(u);
                } else {
                    parent.setRight(u);
                }
                // v = null;
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
            return this.getSuccessor(node.getRight());
        }
        if (node.getLeft() == null && node.getRight() == null) {
            return null;
        }
        if (node.getLeft() != null){
            return node.getLeft();
        }
        return node.getRight();
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
                    if (sibling.getLeft() != null && sibling.getLeft().getColor() === RedBlackNode.RED) {
                        if (sibling.isOnLeft()) {
                            sibling.getLeft().setColor(sibling.getColor());
                            sibling.setColor(parent.getColor());
                            this.rightRotate(parent);
                        } else {
                            sibling.getLeft().setColor(parent.getColor());
                            this.rightRotate(sibling);
                            this.leftRotate(parent);
                        }
                    } else {
                        if (sibling.isOnLeft()) {
                            sibling.getRight().setColor(parent.getColor());
                            this.leftRotate(sibling);
                            this.rightRotate(parent);
                        } else {
                            sibling.getRight().setColor(sibling.getColor());
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
    private fixRedRed(node: RedBlackNode<T>): void {
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
                this.fixRedRed(grandParent);
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
    /**
     * Returns the root node of the tree.
     */
    public getRoot(): RedBlackNode<T> {
        return this.root;
    }
    private getSuccessor(node: RedBlackNode<T>): RedBlackNode<T> {
        let temp = node;
        while (temp.getLeft() != null){
            temp = temp.getLeft();
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
            this.fixRedRed(node);
        }
    }
    /**
     * Checks whether the tree is empty or not.
     */
    public isEmpty(): boolean {
        return this.root == null;
    }
    private leftRotate(node: RedBlackNode<T>): void {
        let p = node.getRight();
        if (node === this.root) {
            this.root = p;
        }
        node.moveDown(p);
        node.setRight(p.getLeft());
        if (p.getLeft() != null) {
            p.getLeft().setParent(node);
        }
        p.setLeft(node);
    }
    private rightRotate(node: RedBlackNode<T>): void {
        let p = node.getLeft();
        if (node === this.root){
            this.root = p;
        }
        node.moveDown(p);
        node.setLeft(p.getRight());
        if (p.getRight() != null) {
            p.getRight().setParent(node);
        }
        p.setRight(node);
    }
    /**
     * Searchs an item in the tree.
     * Returns the node the item belongs to,
     * or null if item does not exists in tree.
     */
    public search(item: T): T {
        const node = this.searchNode(item);
        return node.getData();
    }
    private searchNode(item: T): RedBlackNode<T> {
        let temp: RedBlackNode<T> = this.root;
        while (temp != null) {
            if (this.comparator(item, temp.getData()) < 0) {
                if (temp.getLeft() == null) {
                    break;
                } else {
                    temp = temp.getLeft();
                }
            } else if (item === temp.getData()) {
                break;
            } else {
                if (temp.getRight() == null) {
                    break;
                } else {
                    temp = temp.getRight();
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
    /**
     * Maps the tree data into an array inorderly.
     * @param target The array that the data will be mapped into.
     */
    public toArray(target: T[]=[]): T[] {
        if (this.isEmpty()) return target;
        this.toArrayRecursive(this.root, target);
        return target;
    }
    private toArrayRecursive(root: RedBlackNode<T>, target: T[]): void {
        if (root == null) return;
        this.toArrayRecursive(root.getLeft(), target);
        target.push(root.getData());
        this.toArrayRecursive(root.getRight(), target);
    }
}