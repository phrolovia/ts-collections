import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";
import { PersistentVector } from "../shared/internal/PersistentVector";

// Below this many discarded slots, the vector is never compacted.
const MIN_COMPACTION_SIZE = 32;

/**
 * An immutable circular queue maintains a bounded history of elements. When the capacity is exceeded,
 * the oldest element is discarded and the queue keeps the most recent values.
 *
 * The elements live in a persistent vector behind a start offset, as in {@link ImmutableQueue}:
 * enqueuing appends and discarding advances the offset, so updates share structure instead of
 * copying the queue. The discarded prefix is dropped once it outgrows the queue.
 */
export class ImmutableCircularQueue<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #capacity: number;
    readonly #items: PersistentVector<TElement>;
    readonly #start: number;

    private constructor(capacity: number, items: PersistentVector<TElement>, start: number, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#capacity = capacity;
        this.#items = items;
        this.#start = start;
    }

    public static create<TElement>(): ImmutableCircularQueue<TElement>;
    public static create<TElement>(capacity: number, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public static create<TElement>(capacity: number, elements: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public static create<TElement>(elements: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement>;
    public static create<TElement>(
        capacityOrElements?: number | Iterable<TElement>,
        elementsOrComparator?: Iterable<TElement> | EqualityComparator<TElement>,
        comparator?: EqualityComparator<TElement>
    ): ImmutableCircularQueue<TElement> {
        let capacity = 32;
        let elements: Iterable<TElement> | undefined;
        let comparer: EqualityComparator<TElement> | undefined;

        if (typeof capacityOrElements === "number") {
            capacity = capacityOrElements;
        } else if (capacityOrElements !== undefined) {
            elements = capacityOrElements;
        }

        if (typeof elementsOrComparator === "function") {
            comparer = elementsOrComparator as EqualityComparator<TElement>;
        } else if (elementsOrComparator !== undefined) {
            elements = elementsOrComparator as Iterable<TElement>;
        }

        if (comparator !== undefined) {
            comparer = comparator;
        }

        const normalizedCapacity = Number.isFinite(capacity) ? Math.max(0, Math.trunc(capacity)) : 0;
        return ImmutableCircularQueue.#from<TElement>(normalizedCapacity, elements ?? [], comparer);
    }

    // Keeps the last `capacity` elements of the iterable.
    static #from<TElement>(capacity: number, elements: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableCircularQueue<TElement> {
        const source = capacity === 0 ? [] : Array.from(elements);
        const retained = source.length > capacity ? source.slice(source.length - capacity) : source;
        return new ImmutableCircularQueue<TElement>(capacity, PersistentVector.empty<TElement>().pushAll(retained), 0, comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        let index = 0;
        for (const leaf of this.#items.leaves()) {
            for (let slot = Math.max(this.#start - index, 0); slot < leaf.length; ++slot) {
                yield leaf[slot];
            }
            index += leaf.length;
        }
    }

    /**
     * Adds the given element to this queue. If the queue is full, the oldest element is removed.
     * @param element The element that will be added to this queue.
     * @returns {ImmutableCircularQueue} A new queue with the added element.
     */
    public override add(element: TElement): ImmutableCircularQueue<TElement> {
        if (this.#capacity === 0) {
            return this;
        }
        return this.#with(this.#items.push(element), this.isFull() ? this.#start + 1 : this.#start);
    }

    /**
     * Adds all elements from the provided collection to this queue.
     * Only the most recent elements up to the configured capacity are retained.
     * @param collection The collection whose elements will be added to this queue.
     * @returns {ImmutableCircularQueue} A new queue containing the retained elements.
     */
    public override addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableCircularQueue<TElement> {
        if (this.#capacity === 0) {
            return this;
        }
        const items = this.#items.pushAll(collection);
        return items === this.#items ? this : this.#with(items, Math.max(this.#start, items.size - this.#capacity));
    }

    /**
     * Removes all elements from this queue.
     * @returns {ImmutableCircularQueue} An empty queue that keeps the same capacity and comparator.
     */
    public override clear(): ImmutableCircularQueue<TElement> {
        return this.isEmpty()
            ? this
            : new ImmutableCircularQueue<TElement>(this.#capacity, PersistentVector.empty<TElement>(), 0, this.comparer);
    }

    /**
     * Removes the element at the front of this queue.
     * @returns {ImmutableCircularQueue} A new queue with the head removed.
     * @throws {NoElementsException} Thrown when the queue is empty.
     */
    public dequeue(): ImmutableCircularQueue<TElement> {
        if (this.isEmpty()) {
            throw new NoElementsException();
        }
        return this.#with(this.#items, this.#start + 1);
    }

    /**
     * Adds an element to the end of this queue. This method is equivalent to {@link add}.
     * @param element The element that will be added to this queue.
     * @returns {ImmutableCircularQueue} A new queue with the added element.
     */
    public enqueue(element: TElement): ImmutableCircularQueue<TElement> {
        return this.add(element);
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @returns {TElement} The head of the queue.
     * @throws {NoElementsException} If the queue is empty.
     */
    public front(): TElement {
        if (this.isEmpty()) {
            throw new NoElementsException();
        }
        return this.#items.get(this.#start);
    }

    public override isEmpty(): boolean {
        return this.size() === 0;
    }

    /**
     * Returns whether the queue has reached its capacity.
     * @returns {boolean} True if the queue is full, false otherwise.
     */
    public isFull(): boolean {
        return this.#capacity !== 0 && this.size() === this.#capacity;
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link front}, this method returns null if the queue is empty.
     * @returns {TElement | null} The head of the queue or null if the queue is empty.
     */
    public peek(): TElement | null {
        return this.isEmpty() ? null : this.#items.get(this.#start);
    }

    /**
     * Removes the element at the beginning of the queue and returns the new queue.
     * Unlike {@link dequeue}, this method returns the existing queue if it is empty.
     * @returns {ImmutableCircularQueue} A new queue with the head removed, or this queue if it was empty.
     */
    public poll(): ImmutableCircularQueue<TElement> {
        if (this.isEmpty()) {
            return this;
        }
        return this.#with(this.#items, this.#start + 1);
    }

    /**
     * Replaces all elements in this queue with the elements from the provided collection.
     * Only the most recent elements up to the configured capacity are retained.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableCircularQueue} A new queue containing only the elements from the provided collection, capped by the capacity.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableCircularQueue<TElement> {
        if (this.#capacity === 0) {
            return this;
        }
        if (collection === this) {
            return this;
        }
        return ImmutableCircularQueue.#from<TElement>(this.#capacity, collection, this.comparer);
    }

    public override size(): number {
        return this.#items.size - this.#start;
    }

    // Wraps the window [start, items.size), rebuilding the vector once the discarded prefix outgrows it.
    #with(items: PersistentVector<TElement>, start: number): ImmutableCircularQueue<TElement> {
        const remaining = items.size - start;
        if (start >= MIN_COMPACTION_SIZE && start > remaining) {
            const compacted = PersistentVector.empty<TElement>().asMutable();
            for (let index = start; index < items.size; ++index) {
                compacted.push(items.get(index));
            }
            return new ImmutableCircularQueue<TElement>(this.#capacity, compacted.asImmutable(), 0, this.comparer);
        }
        return new ImmutableCircularQueue<TElement>(this.#capacity, items, start, this.comparer);
    }

    /**
     * The maximum number of elements the queue can retain.
     */
    public get capacity(): number {
        return this.#capacity;
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.size();
    }
}
