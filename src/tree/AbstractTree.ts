import {Predicate} from "../shared/Predicate";
import {AbstractCollection, ITree, TraverseType} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {OrderComparator} from "../shared/OrderComparator";
import {IndexedAction} from "../shared/IndexedAction";
import {Selector} from "../shared/Selector";
import {INode} from "./INode";

export abstract class AbstractTree<TElement> extends AbstractCollection<TElement> implements ITree<TElement> {
    protected readonly orderComparator: OrderComparator<TElement> = null;
    protected root: INode<TElement> = null;

    protected constructor(comparator?: OrderComparator<TElement>) {
        super(((e1: TElement, e2: TElement) => Object.is(e1, e2) || (comparator ?? Comparators.orderComparator)(e1, e2) === 0));
        this.orderComparator = comparator ?? Comparators.orderComparator;
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.nextNode(this.root);
    }

    public clear(): void {
        this.root = null;
    }

    public find(predicate: Predicate<TElement>): TElement {
        if (this.root == null) {
            return null;
        }
        return this.findRecursive(this.root, predicate);
    }

    public findBy<TKey>(key: TKey, selector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        if (this.root == null) {
            return null;
        }
        comparator ??= Comparators.orderComparator;
        return this.findByRecursive(this.root, key, selector, comparator);
    }

    public forEach(action: IndexedAction<TElement>): void {
        if (this.root == null) {
            return;
        }
        super.forEach(action);
    }

    public getRootData(): TElement {
        return this.root?.getData() ?? null;
    }

    public contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparator;
        return this.containsRecursive(this.root, element, comparator);
    }

    public isEmpty(): boolean {
        return this.root == null;
    }

    public remove(element: TElement): boolean {
        if (!this.search(element)) {
            return false;
        }
        this.delete(element);
        return true;
    }

    public removeBy<TKey>(key: TKey, selector: Selector<TElement, TKey>, comparator?: OrderComparator<TKey>): TElement {
        if (this.root == null) {
            return null;
        }
        comparator ??= Comparators.orderComparator;
        return this.removeByRecursive(this.root, key, selector, comparator);
    }

    public size(): number {
        return this.countTreeNodes(this.root);
    }

    public toArray(): TElement[] {
        const target: TElement[] = [];
        if (this.isEmpty()) {
            return target;
        }
        this.toArrayRecursive(<INode<TElement>>this.root, target);
        return target;
    }

    public traverseToArray(direction: TraverseType = "INORDER"): TElement[] {
        const array: TElement[] = [];
        switch (direction) {
            case "INORDER":
                this.toInorderArray(this.root, array);
                break;
            case "POSTORDER":
                this.toPostorderArray(this.root, array);
                break;
            case "PREORDER":
                this.toPreorderArray(this.root, array);
                break;
        }
        return array;
    }

    protected toInorderArray(root: INode<TElement>, target: TElement[]): void {
        if (root == null) return;
        this.toInorderArray(root.getLeft(), target);
        target.push(root.getData());
        this.toInorderArray(root.getRight(), target);
    }

    protected toPostorderArray(root: INode<TElement>, target: TElement[]): void {
        if (root == null) return;
        this.toPostorderArray(root.getLeft(), target);
        this.toPostorderArray(root.getRight(), target);
        target.push(root.getData());
    }

    protected toPreorderArray(root: INode<TElement>, target: TElement[]): void {
        if (root == null) return;
        target.push(root.getData());
        this.toPreorderArray(root.getLeft(), target);
        this.toPreorderArray(root.getRight(), target);
    }

    private containsRecursive(root: INode<TElement>, element: TElement, comparator: EqualityComparator<TElement>): boolean {
        if (root == null) {
            return false;
        }
        const equal = comparator(element, root.getData());
        if (equal) {
            return true;
        }
        const order = this.orderComparator(element, root.getData());
        return order < 0
            ? this.containsRecursive(root.getLeft(), element, comparator)
            : this.containsRecursive(root.getRight(), element, comparator);
    }

    private countTreeNodes(root: INode<TElement>): number {
        if (root == null) {
            return 0;
        }
        return 1 + this.countTreeNodes(root.getLeft()) + this.countTreeNodes(root.getRight());
    }

    private findByRecursive<TKey>(root: INode<TElement>, key: TKey, selector: Selector<TElement, TKey>, comparator: OrderComparator<TKey>): TElement {
        if (root == null) {
            return null;
        }
        const order = comparator(key, selector(root.getData()));
        if(order === 0) {
            return root.getData();
        }
        if (order < 0) {
            return this.findByRecursive(root.getLeft(), key, selector, comparator);
        } else {
            return this.findByRecursive(root.getRight(), key, selector, comparator);
        }
    }

    private findRecursive(root: INode<TElement>, predicate: Predicate<TElement>): TElement {
        if (root == null) {
            return null;
        }
        if (predicate(root.getData())) {
            return root.getData();
        }
        let foundItem: TElement = this.findRecursive(root.getLeft(), predicate);
        if (foundItem != null) {
            return foundItem;
        }
        return this.findRecursive(root.getRight(), predicate);
    }

    private removeByRecursive<TKey>(root: INode<TElement>, key: TKey, selector: Selector<TElement, TKey>, comparator: OrderComparator<TKey>): TElement {
        if (root == null) {
            return null;
        }
        const order = comparator(key, selector(root.getData()));
        if (order === 0) {
            const element = root.getData();
            this.delete(root.getData());
            return element;
        }
        if (order < 0) {
            return this.removeByRecursive(root.getLeft(), key, selector, comparator);
        } else {
            return this.removeByRecursive(root.getRight(), key, selector, comparator);
        }
    }

    private toArrayRecursive(root: INode<TElement>, target: TElement[]): void {
        if (root == null) {
            return;
        }
        this.toArrayRecursive(root.getLeft(), target);
        target.push(root.getData());
        this.toArrayRecursive(root.getRight(), target);
    }

    private* nextNode(node: INode<TElement>): Iterable<TElement> {
        if (!node) {
            return this.getRootData();
        }
        yield* this.nextNode(node.getLeft());
        yield node.getData();
        yield* this.nextNode(node.getRight());
    }

    public abstract add(element: TElement): boolean;
    public abstract delete(element: TElement): void;
    public abstract insert(element: TElement): void;
    public abstract search(element: TElement): boolean;
}
