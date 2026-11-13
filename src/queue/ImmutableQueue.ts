import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";
import { PersistentVector } from "../shared/internal/PersistentVector";

// Below this many dequeued slots, the vector is never compacted.
const MIN_COMPACTION_SIZE = 32;

/**
 * Immutable FIFO queue backed by a persistent vector. Enqueuing appends to the vector and dequeuing
 * advances a start offset, so both share structure with the original queue instead of copying it.
 * The dequeued prefix is dropped once it outgrows the remaining elements, which keeps memory
 * proportional to the queue's size and amortizes the rebuild over the dequeues that caused it.
 */
export class ImmutableQueue<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #items: PersistentVector<TElement>;
    readonly #start: number;

    private constructor(items: PersistentVector<TElement>, start: number, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#items = items;
        this.#start = start;
    }

    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return new ImmutableQueue(PersistentVector.empty<TElement>().pushAll(iterable ?? []), 0, comparator);
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
     * Adds the given element to this queue.
     * @template TElement The type of elements in the queue.
     * @param element The element that will be added to this queue.
     * @returns {ImmutableQueue} A new queue with the added element.
     */
    public add(element: TElement): ImmutableQueue<TElement> {
        return this.enqueue(element);
    }

    /**
     * Adds all elements from the provided collection to this queue.
     * @template TElement The type of elements in the queue.
     * @param collection The collection whose element will be added to this queue.
     * @returns {ImmutableQueue} A new queue with the added elements.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableQueue<TElement> {
        return new ImmutableQueue(this.#items.pushAll(collection), this.#start, this.comparer);
    }

    /**
     * Removes all elements from this queue.
     * @returns {ImmutableQueue} An empty queue.
     */
    public clear(): ImmutableQueue<TElement> {
        return new ImmutableQueue(PersistentVector.empty<TElement>(), 0, this.comparer);
    }

    /**
     * Removes the element at the front of this queue.
     * @returns {ImmutableQueue} A new queue with the element at the front removed.
     * @throws {Error} Thrown when the queue is empty.
     */
    public dequeue(): ImmutableQueue<TElement> {
        if (this.isEmpty()) {
            throw new NoElementsException();
        }
        const start = this.#start + 1;
        const remaining = this.#items.size - start;
        if (start >= MIN_COMPACTION_SIZE && start > remaining) {
            return ImmutableQueue.create(this.skip(1), this.comparer);
        }
        return new ImmutableQueue(this.#items, start, this.comparer);
    }

    /**
     * Adds an element to the end of this queue. This method is equivalent to {@link add}.
     * @template TElement The type of elements in the queue.
     * @param element The element that will be added to this queue.
     * @returns {ImmutableQueue} A new queue with the added element.
     */
    public enqueue(element: TElement): ImmutableQueue<TElement> {
        return new ImmutableQueue(this.#items.push(element), this.#start, this.comparer);
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
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
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link front}, this method returns null if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue or null if the queue is empty.
     */
    public peek(): TElement | null {
        return this.isEmpty() ? null : this.#items.get(this.#start);
    }

    /**
     * Removes the element at the beginning of the queue and returns the new queue.
     * Unlike {@link dequeue}, this method does not throw an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {ImmutableQueue} A new queue with the head removed, or an empty queue if the queue is empty.
     */
    public poll(): ImmutableQueue<TElement> {
        return this.isEmpty() ? this.clear() : this.dequeue();
    }

    /**
     * Replaces all elements in this queue with the elements from the provided collection.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableQueue} A new queue containing only the elements from the provided collection.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableQueue<TElement> {
        if (collection === this) {
            return this;
        }
        return ImmutableQueue.create<TElement>(collection, this.comparer);
    }

    public override size(): number {
        return this.#items.size - this.#start;
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.size();
    }
}
