import { Comparators } from "../Comparators";
import type { OrderComparator } from "../OrderComparator";
import { PersistentVector } from "./PersistentVector";

/**
 * Persistent binary heap. The heap array lives in a {@link PersistentVector}, so adding and
 * polling copy only the O(log n) vector paths touched while sifting instead of the whole heap.
 *
 * The array layout and sift rules match {@link Heap}, so both iterate in the same order.
 * Membership uses the default equality comparator, like {@link Heap}.
 */
export class PersistentHeap<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #items: PersistentVector<TElement>;

    private constructor(items: PersistentVector<TElement>, comparator: OrderComparator<TElement>) {
        this.#items = items;
        this.#comparator = comparator;
    }

    /**
     * Builds a heap from the elements in O(n).
     */
    public static create<TElement>(elements: Iterable<TElement>, comparator: OrderComparator<TElement>): PersistentHeap<TElement> {
        const items = PersistentVector.empty<TElement>().asMutable().pushAll(elements);
        return new PersistentHeap(PersistentHeap.#heapify(items, comparator).asImmutable(), comparator);
    }

    static #heapify<TElement>(items: PersistentVector<TElement>, comparator: OrderComparator<TElement>): PersistentVector<TElement> {
        for (let index = Math.floor((items.size - 2) / 2); index >= 0; --index) {
            PersistentHeap.#siftDown(items, index, comparator);
        }
        return items;
    }

    // Both sifts move a hole instead of swapping, which ends in the same layout with fewer writes.
    static #siftDown<TElement>(items: PersistentVector<TElement>, index: number, comparator: OrderComparator<TElement>): void {
        const size = items.size;
        const element = items.get(index);
        for (let child = 2 * index + 1; child < size; child = 2 * index + 1) {
            let childElement = items.get(child);
            if (child + 1 < size) {
                const right = items.get(child + 1);
                if (comparator(right, childElement) < 0) {
                    ++child;
                    childElement = right;
                }
            }
            if (comparator(element, childElement) <= 0) {
                break;
            }
            items.set(index, childElement);
            index = child;
        }
        if (items.get(index) !== element) {
            items.set(index, element);
        }
    }

    static #siftUp<TElement>(items: PersistentVector<TElement>, index: number, comparator: OrderComparator<TElement>): void {
        const element = items.get(index);
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            const parentElement = items.get(parent);
            if (comparator(parentElement, element) <= 0) {
                break;
            }
            items.set(index, parentElement);
            index = parent;
        }
        if (items.get(index) !== element) {
            items.set(index, element);
        }
    }

    [Symbol.iterator](): Iterator<TElement> {
        return this.#items[Symbol.iterator]();
    }

    public add(element: TElement): PersistentHeap<TElement> {
        return this.addAll([element]);
    }

    /**
     * Adds the elements one at a time. Returns this heap if the iterable is empty.
     */
    public addAll(elements: Iterable<TElement>): PersistentHeap<TElement> {
        const items = this.#items.asMutable();
        for (const element of elements) {
            items.push(element);
            PersistentHeap.#siftUp(items, items.size - 1, this.#comparator);
        }
        return items.size === this.#items.size ? this : this.#with(items.asImmutable());
    }

    public contains(element: TElement): boolean {
        return this.#indexOf(element) !== -1;
    }

    public peek(): TElement | null {
        return this.#items.size === 0 ? null : this.#items.get(0);
    }

    /**
     * Removes the root element. Returns this heap if it is empty.
     */
    public poll(): PersistentHeap<TElement> {
        return this.#items.size === 0 ? this : this.#removeAt(0);
    }

    /**
     * Removes the first element equal to the given one. Returns this heap if there is none.
     */
    public remove(element: TElement): PersistentHeap<TElement> {
        const index = this.#indexOf(element);
        return index === -1 ? this : this.#removeAt(index);
    }

    /**
     * Removes every element matching the predicate and rebuilds the heap in O(n).
     * Returns this heap if nothing matched.
     */
    public removeWhere(predicate: (element: TElement) => boolean): PersistentHeap<TElement> {
        const kept: Array<TElement> = [];
        for (const element of this.#items) {
            if (!predicate(element)) {
                kept.push(element);
            }
        }
        return kept.length === this.#items.size ? this : PersistentHeap.create(kept, this.#comparator);
    }

    #indexOf(element: TElement): number {
        let index = 0;
        for (const e of this.#items) {
            if (Comparators.equalityComparator(e, element)) {
                return index;
            }
            ++index;
        }
        return -1;
    }

    // Moves the last element into the gap, then restores the heap order around it.
    #removeAt(index: number): PersistentHeap<TElement> {
        const items = this.#items.asMutable();
        const last = items.get(items.size - 1);
        items.pop();
        if (index < items.size) {
            items.set(index, last);
            PersistentHeap.#siftDown(items, index, this.#comparator);
            PersistentHeap.#siftUp(items, index, this.#comparator);
        }
        return this.#with(items.asImmutable());
    }

    #with(items: PersistentVector<TElement>): PersistentHeap<TElement> {
        return new PersistentHeap(items, this.#comparator);
    }

    public get size(): number {
        return this.#items.size;
    }
}
