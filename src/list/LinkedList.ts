import {EqualityComparator} from "../shared/EqualityComparator";
import {AbstractList, IDeque} from "../../imports";
import {ErrorMessages} from "../shared/ErrorMessages";
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

    public constructor(iterable?: Iterable<TElement>) {
        super();
        if (iterable) {
            for (const element of iterable) {
                this.add(element);
            }
        }
    }

    public static from<TSource>(iterable: Iterable<TSource>): LinkedList<TSource> {
        return new LinkedList<TSource>(iterable);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (let node = this.firstNode; node != null; node = node.next) {
            yield node.item;
        }
    }

    public add(element: TElement): boolean {
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
        for (let x: Node<TElement> = this.firstNode; x != null;) {
            const next = x.next;
            x.item = null;
            x.next = null;
            x.prev = null;
            x = next;
        }
        this.firstNode = this.lastNode = null;
        this.listSize = 0;
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

    public remove(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        if (element == null) {
            for (let x: Node<TElement> = this.firstNode; x != null; x = x.next) {
                if (x.item == null) {
                    this.unlink(x);
                    return true;
                }
            }
        } else {
            for (let x: Node<TElement> = this.firstNode; x != null; x = x.next) {
                if (comparator(x.item, element)) {
                    this.unlink(x);
                    return true;
                }
            }
        }
    }

    public removeAt(index: number): TElement {
        this.checkElementIndex(index);
        return this.unlink(this.node(index));
    }

    public set(index: number, element: TElement): TElement {
        this.checkElementIndex(index);
        const x = this.node(index);
        const oldElement = x.item;
        x.item = element;
        return oldElement;
    }

    public size(): number {
        return this.listSize;
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
        this.listSize++;
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
        this.listSize++;
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
        this.listSize++;
    }

    private node(index: number): Node<TElement> {
        if (index < (this.listSize >> 1)) {
            let x = this.firstNode;
            for (let ix = 0; ix < index; ++ix) {
                x = x.next;
            }
            return x;
        } else {
            let x = this.lastNode;
            for (let ix = this.listSize - 1; ix > index; --ix) {
                x = x.prev;
            }
            return x;
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

    private unlink(x: Node<TElement>): TElement {
        const element: TElement = x.item;
        const next = x.next;
        const prev = x.prev;

        if (prev == null) {
            this.firstNode = next;
        } else {
            prev.next = next;
            x.prev = null;
        }

        if (next == null) {
            this.lastNode = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }

        x.item = null;
        this.listSize--;
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
        this.listSize--;
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
        this.listSize--;
        return element;
    }
}
