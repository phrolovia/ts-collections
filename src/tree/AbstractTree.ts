import {ITree, TraverseType} from "./ITree";
import {INode} from "./INode";
import {Predicate} from "../shared/Predicate";
import {AbstractCollection} from "../../imports";
import {EqualityComparator} from "../shared/EqualityComparator";
import {Comparators} from "../shared/Comparators";
import {OrderComparator} from "../shared/OrderComparator";
import {IndexedAction} from "../shared/IndexedAction";

export abstract class AbstractTree<TElement> extends AbstractCollection<TElement> implements ITree<TElement> {
    protected readonly orderComparator: OrderComparator<TElement> = null;
    protected root: INode<TElement> = null;

    protected constructor(comparator?: OrderComparator<TElement>) {
        super(((e1, e2) => Object.is(e1, e2) || (comparator ?? Comparators.orderComparator)(e1, e2) === 0));
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

    public forEach(action: IndexedAction<TElement>): void {
        if (this.root == null) {
            return;
        }
        super.forEach(action);
    }

    public getRootData(): TElement {
        if (!this.root) {
            return null;
        }
        return this.root.getData();
    }

    public contains(item: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= this.comparator;
        return this.containsRecursive(this.root, item, comparator);
    }

    public isEmpty(): boolean {
        return this.root == null;
    }

    public remove(item: TElement): boolean {
        if (!this.contains(item, this.comparator)) {
            return false;
        }
        this.delete(item);
        return true;
    }

    public size(): number {
        return this.countTreeNodes(this.root);
    }

    public toArray(): TElement[] {
        const target: TElement[] = [];
        if (this.isEmpty()) return target;
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

    private containsRecursive(root: INode<TElement>, item: TElement, comparator: EqualityComparator<TElement>): boolean {
        if (root == null) {
            return false;
        }
        const equal = comparator(item, root.getData());
        if (equal) {
            return true;
        }
        const order = this.orderComparator(item, root.getData());
        return order < 0
            ? this.containsRecursive(root.getLeft(), item, comparator)
            : this.containsRecursive(root.getRight(), item, comparator);
    }

    private countTreeNodes(root: INode<TElement>): number {
        if (root == null) {
            return 0;
        }
        return 1 + this.countTreeNodes(root.getLeft()) + this.countTreeNodes(root.getRight());
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

    public abstract add(item: TElement): boolean;
    public abstract delete(item: TElement): void;
    public abstract insert(item: TElement): void;
    public abstract search(item: TElement): boolean;
}
