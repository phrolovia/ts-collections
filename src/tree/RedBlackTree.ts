/**
 * Algorithm taken from https://www.geeksforgeeks.org/red-black-tree-set-3-delete-2/
 *
 * March 27. 2025
 * --------------
 * This implementation was heavily modified/refactored with the help of Junie AI agent
 * to improve readability, maintainability and performance.
 */

import { AbstractTree } from "../imports";
import { OrderComparator } from "../shared/OrderComparator";
import { Predicate } from "../shared/Predicate";
import { TreeNode } from "./TreeNode";

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
    }

    public add(element: TElement): boolean {
        // Combine search and insert into a single operation
        if (this.root == null) {
            const node = new RedBlackNode<TElement>(element);
            node.setColor(RedBlackNode.BLACK);
            this.root = node;
            this.treeSize++;
            return true;
        }

        try {
            const temp: RedBlackNode<TElement> = this.searchNode(element);

            // Check if element already exists
            if (this.orderComparator(temp.getData(), element) === 0) {
                return false;
            }

            // Create and insert new node
            const node = new RedBlackNode<TElement>(element);
            node.setParent(temp);
            if (this.orderComparator(element, temp.getData()) < 0) {
                temp.setLeft(node);
            } else {
                temp.setRight(node);
            }

            // Fix the tree to maintain Red-Black properties
            this.fixDoubleRed(node);
            this.treeSize++;
            return true;
        } catch (error) {
            // This should not happen since we check for root == null above,
            // but it's good practice to handle potential exceptions
            return false;
        }
    }

    public delete(element: TElement): void {
        if (this.root == null) {
            return;
        }

        try {
            const node = this.searchNode(element);
            // Check if the node contains the element we're looking for
            if (this.orderComparator(node.getData(), element) !== 0) {
                return;
            }
            this.deleteNode(node);
            this.treeSize--;
        } catch (error) {
            // Handle the case where searchNode throws an error
            // This should not happen since we check for root == null above,
            // but it's good practice to handle potential exceptions
            return;
        }
    }

    public insert(element: TElement): void {
        const node = new RedBlackNode<TElement>(element);
        if (this.root == null) {
            node.setColor(RedBlackNode.BLACK);
            this.root = node;
            this.treeSize++;
            return;
        }

        try {
            const temp: RedBlackNode<TElement> = this.searchNode(element);
            if (this.orderComparator(temp.getData(), element) === 0) {
                return; // Element already exists, don't insert
            }

            // Insert the new node
            node.setParent(temp);
            if (this.orderComparator(element, temp.getData()) < 0) {
                temp.setLeft(node);
            } else {
                temp.setRight(node);
            }

            // Fix the tree to maintain Red-Black properties
            this.fixDoubleRed(node);
            this.treeSize++;
        } catch (error) {
            // This should not happen since we check for root == null above,
            // but it's good practice to handle potential exceptions
            return;
        }
    }

    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const oldSize = this.size();
        for (const element of collection) {
            this.delete(element);
        }
        return this.size() !== oldSize;
    }

    public removeIf(predicate: Predicate<TElement>): boolean {
        if (this.root == null) {
            return false;
        }

        const oldSize = this.size();
        // Collect elements to remove
        const elementsToRemove: TElement[] = [];

        // Use in-order traversal to collect elements that match the predicate
        const stack: RedBlackNode<TElement>[] = [];
        let current: RedBlackNode<TElement> | null = this.root as RedBlackNode<TElement>;

        while (current != null || stack.length > 0) {
            while (current != null) {
                stack.push(current);
                current = current.getLeft() as RedBlackNode<TElement> | null;
            }

            current = stack.pop() || null;
            if (current != null) {
                const element = current.getData();
                if (predicate(element)) {
                    elementsToRemove.push(element);
                }
                current = current.getRight() as RedBlackNode<TElement> | null;
            }
        }

        // Delete each element that matches the predicate
        for (const element of elementsToRemove) {
            this.delete(element);
        }

        return this.size() !== oldSize;
    }

    public search(element: TElement): boolean {
        if (this.root == null) {
            return false;
        }

        let temp: RedBlackNode<TElement> = this.root as RedBlackNode<TElement>;
        while (temp != null) {
            const compareResult = this.orderComparator(element, temp.getData());
            if (compareResult < 0) {
                if (temp.getLeft() == null) {
                    return false;
                }
                temp = temp.getLeft() as RedBlackNode<TElement>;
            } else if (this.comparer(element, temp.getData())) {
                return true;
            } else {
                if (temp.getRight() == null) {
                    return false;
                }
                temp = temp.getRight() as RedBlackNode<TElement>;
            }
        }
        return false;
    }

    private canMoveLeft(node: RedBlackNode<TElement>): boolean {
        return node.getLeft() != null;
    }

    private canMoveRight(node: RedBlackNode<TElement>): boolean {
        return node.getRight() != null;
    }

    private deleteNode(v: RedBlackNode<TElement>): void {
        let u: RedBlackNode<TElement> | null = this.findReplaceItem(v);
        const bothBlack = ((u == null || u.getColor() === RedBlackNode.BLACK) && v.getColor() === RedBlackNode.BLACK);
        let parent: RedBlackNode<TElement> | null = v.getParent();

        if (u === null) {
            this.handleNullReplacement(v, bothBlack, parent);
            return;
        }

        if (v.getLeft() == null || v.getRight() == null) {
            this.handleSingleChildReplacement(v, u, bothBlack, parent);
            return;
        }

        // If we get here, v has two children
        this.swapValues(u, v);
        this.deleteNode(u);
    }

    private detachNodeFromParent(
        node: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement> | null,
        replacement: RedBlackNode<TElement> | null
    ): void {
        if (parent === null) return;

        if (node.isOnLeft()) {
            parent.setLeft(replacement);
        } else {
            parent.setRight(replacement);
        }
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
            return;
        }

        if (sibling.getColor() === RedBlackNode.RED) {
            this.handleRedSibling(node, sibling, parent);
        } else {
            this.handleBlackSibling(sibling, parent);
        }
    }

    private fixDoubleRed(node: RedBlackNode<TElement>): void {
        // If node is root, just color it black
        if (node === this.root) {
            node.setColor(RedBlackNode.BLACK);
            return;
        }

        let parent = node.getParent() as RedBlackNode<TElement>;

        // If parent is black, no double red violation
        if (parent.getColor() === RedBlackNode.BLACK) {
            return;
        }

        let grandParent = parent.getParent() as RedBlackNode<TElement>;
        let uncle: RedBlackNode<TElement> | null = node.getUncle();

        if (uncle != null && uncle.getColor() === RedBlackNode.RED) {
            this.handleRedUncle(parent, uncle, grandParent);
        } else {
            this.handleBlackOrNullUncle(node, parent, grandParent);
        }
    }

    private getSuccessor(node: RedBlackNode<TElement>): RedBlackNode<TElement> {
        let temp = node;
        while (temp.getLeft() != null) {
            temp = temp.getLeft() as RedBlackNode<TElement>;
        }
        return temp;
    }

    private handleBlackOrNullUncle(
        node: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>,
        grandParent: RedBlackNode<TElement>
    ): void {
        if (parent.isOnLeft()) {
            this.handleLeftParent(node, parent, grandParent);
        } else {
            this.handleRightParent(node, parent, grandParent);
        }
    }

    private handleBlackSibling(
        sibling: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>
    ): void {
        if (sibling.hasRedChild()) {
            this.handleBlackSiblingWithRedChild(sibling, parent);
        } else {
            this.handleBlackSiblingWithBlackChildren(sibling, parent);
        }
    }

    private handleRedSibling(
        node: RedBlackNode<TElement>,
        sibling: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>
    ): void {
        parent.setColor(RedBlackNode.RED);
        sibling.setColor(RedBlackNode.BLACK);

        if (sibling.isOnLeft()) {
            this.rightRotate(parent);
        } else {
            this.leftRotate(parent);
        }

        this.fixDoubleBlack(node);
    }

    private handleRedUncle(
        parent: RedBlackNode<TElement>,
        uncle: RedBlackNode<TElement>,
        grandParent: RedBlackNode<TElement>
    ): void {
        // Color parent and uncle black, grandparent red
        parent.setColor(RedBlackNode.BLACK);
        uncle.setColor(RedBlackNode.BLACK);
        grandParent.setColor(RedBlackNode.RED);

        // Recursively fix any double red violation at grandparent
        this.fixDoubleRed(grandParent);
    }

    private handleBlackSiblingWithBlackChildren(
        sibling: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>
    ): void {
        sibling.setColor(RedBlackNode.RED);

        if (parent.getColor() === RedBlackNode.BLACK) {
            this.fixDoubleBlack(parent);
        } else {
            parent.setColor(RedBlackNode.BLACK);
        }
    }

    private handleBlackSiblingWithRedChild(
        sibling: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>
    ): void {
        const hasRedLeftChild =
            (sibling.getLeft() as RedBlackNode<TElement>) != null &&
            (sibling.getLeft() as RedBlackNode<TElement>).getColor() === RedBlackNode.RED;

        if (hasRedLeftChild) {
            this.handleSiblingWithRedLeftChild(sibling, parent);
        } else {
            this.handleSiblingWithRedRightChild(sibling, parent);
        }

        parent.setColor(RedBlackNode.BLACK);
    }

    private handleLeftParent(
        node: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>,
        grandParent: RedBlackNode<TElement>
    ): void {
        if (node.isOnLeft()) {
            // Left-Left case
            this.swapColors(parent, grandParent);
        } else {
            // Left-Right case
            this.leftRotate(parent);
            this.swapColors(node, grandParent);
        }

        // Common step for both Left-Left and Left-Right cases
        this.rightRotate(grandParent);
    }

    private handleRightParent(
        node: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>,
        grandParent: RedBlackNode<TElement>
    ): void {
        if (node.isOnLeft()) {
            // Right-Left case
            this.rightRotate(parent);
            this.swapColors(node, grandParent);
        } else {
            // Right-Right case
            this.swapColors(parent, grandParent);
        }

        // Common step for both Right-Left and Right-Right cases
        this.leftRotate(grandParent);
    }

    private handleSiblingWithRedLeftChild(
        sibling: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>
    ): void {
        if (sibling.isOnLeft()) {
            (sibling.getLeft() as RedBlackNode<TElement>).setColor(sibling.getColor());
            sibling.setColor(parent.getColor());
            this.rightRotate(parent);
        } else {
            (sibling.getLeft() as RedBlackNode<TElement>).setColor(parent.getColor());
            this.rightRotate(sibling);
            this.leftRotate(parent);
        }
    }

    private handleSiblingWithRedRightChild(
        sibling: RedBlackNode<TElement>,
        parent: RedBlackNode<TElement>
    ): void {
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

    private handleSingleChildReplacement(
        node: RedBlackNode<TElement>,
        replacement: RedBlackNode<TElement>,
        bothBlack: boolean,
        parent: RedBlackNode<TElement> | null
    ): void {
        if (node === this.root) {
            // If node is root, make replacement the new root
            node.setData(replacement.getData());
            node.setLeft(null);
            node.setRight(null);
            return;
        }

        // Attach replacement to parent
        this.detachNodeFromParent(node, parent, replacement);
        replacement.setParent(parent);

        // Handle color violations
        if (bothBlack) {
            this.fixDoubleBlack(replacement);
        } else {
            replacement.setColor(RedBlackNode.BLACK);
        }
    }

    private handleNullReplacement(
        node: RedBlackNode<TElement>,
        bothBlack: boolean,
        parent: RedBlackNode<TElement> | null
    ): void {
        if (node === this.root) {
            // If node is root with no children, tree becomes empty
            this.root = null;
            return;
        }

        // Handle color violations
        if (bothBlack) {
            this.fixDoubleBlack(node);
        } else if (node.getSibling() != null) {
            node.getSibling()?.setColor(RedBlackNode.RED);
        }

        // Remove node from parent
        this.detachNodeFromParent(node, parent, null);
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
        if (this.root == null) {
            throw new Error("Cannot search in an empty tree");
        }

        let current: RedBlackNode<TElement> = this.root as RedBlackNode<TElement>;

        while (true) {
            const compareResult = this.orderComparator(element, current.getData());

            if (compareResult < 0) {
                // Element is less than current node
                if (this.canMoveLeft(current)) {
                    current = this.moveLeft(current);
                } else {
                    return current; // Return current node as insertion point
                }
            } else if (this.isExactMatch(element, current.getData())) {
                return current; // Found exact match
            } else {
                // Element is greater than current node
                if (this.canMoveRight(current)) {
                    current = this.moveRight(current);
                } else {
                    return current; // Return current node as insertion point
                }
            }
        }
    }

    private isExactMatch(element1: TElement, element2: TElement): boolean {
        return this.comparer(element1, element2);
    }

    private moveLeft(node: RedBlackNode<TElement>): RedBlackNode<TElement> {
        return node.getLeft() as RedBlackNode<TElement>;
    }

    private moveRight(node: RedBlackNode<TElement>): RedBlackNode<TElement> {
        return node.getRight() as RedBlackNode<TElement>;
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
