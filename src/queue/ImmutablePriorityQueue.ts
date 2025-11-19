import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import { Heap } from "../heap/Heap";
import { Comparators } from "../shared/Comparators";
import { NoElementsException } from "../shared/NoElementsException";
import { OrderComparator } from "../shared/OrderComparator";
import { Predicate } from "../shared/Predicate";
import { registerImmutablePriorityQueueFactory } from "../enumerator/Enumerator";

export class ImmutablePriorityQueue<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #heap: Heap<TElement>;

    private constructor(iterable?: Iterable<TElement>, comparator?: OrderComparator<TElement>) {
        super();
        this.#comparator = comparator ?? Comparators.orderComparator;
        this.#heap = new Heap(this.#comparator, iterable ?? []);
    }

    /**
     * Creates a new immutable priority queue.
     * @template TElement The type of elements in the queue.
     * @param iterable An optional iterable to populate the queue with.
     * @param comparator An optional order comparator for the elements.
     * @returns {ImmutablePriorityQueue<TElement>} A new immutable priority queue.
     */
    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement> {
        return new ImmutablePriorityQueue(iterable, comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        // Iterating over a heap doesn't guarantee priority order,
        // it usually gives heap order (level by level).
        // To iterate in priority order, one would typically poll repeatedly,
        // but that's inefficient and doesn't fit an immutable iterator.
        // We delegate to the heap's natural iteration order.
        yield* this.#heap;
    }

    /**
     * Adds the given element to this priority queue.
     * @template TElement The type of elements in the queue.
     * @param element The element to add.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue with the added element.
     */
    public override add(element: TElement): ImmutablePriorityQueue<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        newHeap.add(element);
        return new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator);
    }

    /**
     * Adds all elements from the provided collection to this priority queue.
     * @template TElement The type of elements in the queue.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will be added.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue with the added elements.
     */
    public override addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutablePriorityQueue<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        let added = false;
        for (const element of collection) {
            newHeap.add(element);
            added = true;
        }
        return added ? new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator) : this;
    }

    /**
     * Removes all elements from this priority queue.
     * @returns {ImmutablePriorityQueue<TElement>} An empty priority queue with the same comparator.
     */
    public override clear(): ImmutablePriorityQueue<TElement> {
        return this.isEmpty() ? this : new ImmutablePriorityQueue<TElement>([], this.#comparator);
    }

    /**
     * Checks if the priority queue contains the specified element.
     * Note: This operation can be inefficient on a heap (O(N)).
     * @param element The element to locate.
     * @returns {boolean} True if the element is found; otherwise, false.
     */
    public override contains(element: TElement): boolean {
        return this.#heap.contains(element);
    }

    /**
     * Checks if this collection contains all the elements of the given collection.
     * Note: This operation can be inefficient on a heap (O(N*M)).
     * @param collection The collection whose elements will be tested for existence.
     * @returns {boolean} True if this collection contains all the elements, false otherwise.
     */
    public override containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        return this.#heap.containsAll(collection);
    }

    /**
     * Removes the element with the highest priority from the queue.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue with the highest priority element removed.
     * @throws {NoElementsException} If the queue is empty.
     */
    public dequeue(): ImmutablePriorityQueue<TElement> {
        if (this.isEmpty()) {
            throw new NoElementsException();
        }
        const newHeap = new Heap(this.#comparator, this.#heap);
        newHeap.poll();
        return new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator);
    }

    /**
     * Adds an element to this priority queue. This is an alias for `add`.
     * @template TElement The type of elements in the queue.
     * @param element The element to add.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue with the added element.
     */
    public enqueue(element: TElement): ImmutablePriorityQueue<TElement> {
        return this.add(element);
    }

    /**
     * Retrieves, but does not remove, the element with the highest priority.
     * @returns {TElement} The element with the highest priority.
     * @throws {NoElementsException} If the queue is empty.
     */
    public front(): TElement {
        if (this.isEmpty()) {
            throw new NoElementsException();
        }
        return this.#heap.peek() as TElement;
    }

    /**
     * Checks if the priority queue is empty.
     * @returns {boolean} True if the queue is empty, false otherwise.
     */
    public override isEmpty(): boolean {
        return this.#heap.isEmpty();
    }

    /**
     * Retrieves, but does not remove, the element with the highest priority, or returns null if the queue is empty.
     * @returns {TElement | null} The element with the highest priority, or null if the queue is empty.
     */
    public peek(): TElement | null {
        return this.#heap.peek();
    }

    /**
     * Removes the element with the highest priority from the queue.
     * If the queue is empty, returns an empty queue.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue with the highest priority element removed, or an empty queue if the original was empty.
     */
    public poll(): ImmutablePriorityQueue<TElement> {
        if (this.isEmpty()) {
            return this;
        }
        const newHeap = new Heap(this.#comparator, this.#heap);
        newHeap.poll();
        return new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator);
    }

    /**
     * Removes the specified element from the priority queue.
     * Note: This operation can be inefficient on a heap (O(N)).
     * @param element The element to remove.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue without the specified element, or the original queue if the element was not found.
     */
    public remove(element: TElement): ImmutablePriorityQueue<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        const removed = newHeap.remove(element);
        return removed ? new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator) : this;
    }

    /**
     * Removes all elements from this queue that are contained in the specified collection.
     * Note: This operation can be inefficient on a heap (O(N*M)).
     * @param collection The collection whose elements will be removed.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue without the specified elements.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutablePriorityQueue<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        const changed = newHeap.removeAll(collection);
        return changed ? new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator) : this;
    }

    /**
     * Removes all elements from this queue that satisfy the specified predicate.
     * Note: This operation can be inefficient on a heap (O(N)).
     * @param predicate The predicate used to test elements.
     * @returns {ImmutablePriorityQueue<TElement>} A new priority queue without the elements satisfying the predicate.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutablePriorityQueue<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        const changed = newHeap.removeIf(predicate);
        return changed ? new ImmutablePriorityQueue<TElement>(newHeap, this.#comparator) : this;
    }

    public override size(): number {
        return this.#heap.size();
    }

    /**
     * Gets the order comparator used by the priority queue.
     * @returns {OrderComparator<TElement>} The comparator.
     */
    public override get comparator(): OrderComparator<TElement> {
        return this.#comparator;
    }

    public override get length(): number {
        return this.#heap.length;
    }
}

registerImmutablePriorityQueueFactory(<TElement>(iterable: Iterable<TElement>, comparator?: OrderComparator<TElement>): ImmutablePriorityQueue<TElement> => {
    return ImmutablePriorityQueue.create(iterable, comparator);
});
