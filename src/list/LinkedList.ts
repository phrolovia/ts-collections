import {AbstractList, IDeque} from "../../imports";
import {ErrorMessages} from "../shared/ErrorMessages";
import {EqualityComparator} from "../shared/EqualityComparator";
import {OrderComparator} from "../shared/OrderComparator";
import {Comparators} from "../shared/Comparators";

class Node<TElement> {
    public item: TElement;
    public next: Node<TElement>;
    public prev: Node<TElement>;

    public constructor(prev: Node<TElement>, item: TElement, next: Node<TElement>) {
        this.prev = prev;
        this.item = item;
        this.next = next;
    }
}

export class LinkedList<TElement> extends AbstractList<TElement> implements IDeque<TElement> {
    private firstNode: Node<TElement> = null;
    private lastNode: Node<TElement> = null;
    private listSize: number = 0;

    public constructor(
        iterable: Iterable<TElement> = [] as TElement[],
        comparator?: EqualityComparator<TElement>
    ) {
        super(comparator);
        if (iterable) {
            for (const element of iterable) {
                this.add(element);
            }
        }
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (let node = this.firstNode; node != null; node = node.next) {
            yield node.item;
        }
    }

    public override add(element: TElement): boolean {
        this.linkLast(element);
        return true;
    }

    public addAt(element: TElement, index: number): boolean {
        this.checkPositionIndex(index);
        if (index === this.listSize) {
            this.linkLast(element);
        } else {
            this.linkBefore(element, this.node(index));
        }
        return false;
    }

    public clear(): void {
        for (let node: Node<TElement> = this.firstNode; node != null;) {
            const next = node.next;
            node.item = null;
            node.next = null;
            node.prev = null;
            node = next;
        }
        this.firstNode = this.lastNode = null;
        this.ListSize = 0;
    }

    public dequeue(): TElement {
        return this.removeFirst();
    }

    public dequeueLast(): TElement {
        return this.removeLast();
    }

    public enqueue(element: TElement) {
        this.add(element);
    }

    public enqueueFirst(element: TElement) {
        this.linkFirst(element);
    }

    public get(index: number): TElement {
        this.checkElementIndex(index);
        return this.node(index).item;
    }

    public peek(): TElement {
        const node = this.firstNode;
        return node?.item ?? null;
    }

    public peekLast(): TElement {
        const node = this.lastNode;
        return node?.item ?? null;
    }

    public poll(): TElement {
        const node = this.firstNode;
        return node == null ? null : this.unlinkFirst(node);
    }

    public pollLast(): TElement {
        const node = this.lastNode;
        return node == null ? null : this.unlinkLast(node);
    }

    public remove(element: TElement): boolean {
        if (element == null) {
            for (let node: Node<TElement> = this.firstNode; node != null; node = node.next) {
                if (node.item == null) {
                    this.unlink(node);
                    return true;
                }
            }
        } else {
            for (let node: Node<TElement> = this.firstNode; node != null; node = node.next) {
                if (this.comparator(node.item, element)) {
                    this.unlink(node);
                    return true;
                }
            }
        }
        return false;
    }

    public removeAt(index: number): TElement {
        this.checkElementIndex(index);
        return this.unlink(this.node(index));
    }

    public set(index: number, element: TElement): TElement {
        this.checkElementIndex(index);
        const node = this.node(index);
        const oldElement = node.item;
        node.item = element;
        return oldElement;
    }

    public size(): number {
        return this.listSize;
    }

    public sort(comparator?: OrderComparator<TElement>): void {
        const array = this.toArray();
        comparator ??= Comparators.orderComparator;
        array.sort(comparator);
        for (const [index, element] of array.entries()) {
            this.set(index, element);
        }
    }

    private checkElementIndex(index: number): void {
        if (!this.isElementIndex(index)) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
    }

    private checkPositionIndex(index: number): void {
        if (!this.isPositionIndex(index)) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
    }

    private isElementIndex(index: number): boolean {
        return index >= 0 && index < this.listSize;
    }

    private isPositionIndex(index: number): boolean {
        return index >= 0 && index <= this.listSize;
    }

    private linkBefore(element: TElement, successor: Node<TElement>): void {
        const predecessor: Node<TElement> = successor.prev;
        const newNode = new Node<TElement>(predecessor, element, successor);
        successor.prev = newNode;
        if (predecessor == null) {
            this.firstNode = newNode;
        } else {
            predecessor.next = newNode;
        }
        this.ListSize = this.listSize + 1;
    }

    private linkFirst(element: TElement): void {
        const firstNode = this.firstNode;
        const newNode = new Node<TElement>(null, element, firstNode);
        this.firstNode = newNode;
        if (firstNode == null) {
            this.lastNode = newNode;
        } else {
            firstNode.prev = newNode;
        }
        this.ListSize = this.listSize + 1;
    }

    private linkLast(element: TElement): void {
        const last = this.lastNode;
        const newNode: Node<TElement> = new Node<TElement>(last, element, null);
        this.lastNode = newNode;
        if (last == null) {
            this.firstNode = newNode
        } else {
            last.next = newNode;
        }
        this.ListSize = this.listSize + 1;
    }

    private node(index: number): Node<TElement> {
        if (index < (this.listSize >> 1)) {
            let node = this.firstNode;
            for (let ix = 0; ix < index; ++ix) {
                node = node.next;
            }
            return node;
        } else {
            let node = this.lastNode;
            for (let ix = this.listSize - 1; ix > index; --ix) {
                node = node.prev;
            }
            return node;
        }
    }

    private removeFirst(): TElement {
        const firstNode = this.firstNode;
        if (firstNode == null) {
            throw new Error(ErrorMessages.NoElements);
        }
        return this.unlinkFirst(firstNode);
    }

    private removeLast(): TElement {
        const lastNode = this.lastNode;
        if (lastNode == null) {
            throw new Error(ErrorMessages.NoElements);
        }
        return this.unlinkLast(lastNode);
    }

    private unlink(node: Node<TElement>): TElement {
        const element: TElement = node.item;
        const next = node.next;
        const prev = node.prev;

        if (prev == null) {
            this.firstNode = next;
        } else {
            prev.next = next;
            node.prev = null;
        }

        if (next == null) {
            this.lastNode = prev;
        } else {
            next.prev = prev;
            node.next = null;
        }

        node.item = null;
        this.ListSize = this.listSize - 1;
        return element;
    }

    private unlinkFirst(firstNode: Node<TElement>): TElement {
        const element = firstNode.item;
        const next = firstNode.next;
        firstNode.item = null;
        firstNode.next = null;
        this.firstNode = next;
        if (next == null) {
            this.lastNode = null;
        } else {
            next.prev = null;
        }
        this.ListSize = this.listSize - 1;
        return element;
    }

    private unlinkLast(lastNode: Node<TElement>): TElement {
        const element = lastNode.item;
        const prev = lastNode.prev;
        lastNode.item = null;
        lastNode.prev = null;
        this.lastNode = prev;
        if (prev == null) {
            this.firstNode = null;
        } else {
            prev.next = null;
        }
        this.ListSize = this.listSize - 1;
        return element;
    }

    private set ListSize(size: number) {
        this.listSize = size;
        this.updateLength();
    }
}
