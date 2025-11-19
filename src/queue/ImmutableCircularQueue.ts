import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";

/**
 * An immutable circular queue maintains a bounded history of elements. When the capacity is exceeded,
 * the oldest element is discarded and the queue keeps the most recent values.
 */
export class ImmutableCircularQueue<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #capacity: number;
    readonly #elements: readonly TElement[];

    private constructor(capacity: number, elements?: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        const normalizedCapacity = Number.isFinite(capacity) ? Math.max(0, Math.trunc(capacity)) : 0;
        this.#capacity = normalizedCapacity;
        const source = elements ? Array.from(elements) : [];
        this.#elements = normalizedCapacity === 0
            ? []
            : source.slice(Math.max(0, source.length - normalizedCapacity));
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

        return new ImmutableCircularQueue<TElement>(capacity, elements, comparer);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#elements;
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
        const elements = this.isFull()
            ? [...this.#elements.slice(1), element]
            : [...this.#elements, element];
        return new ImmutableCircularQueue<TElement>(this.#capacity, elements, this.comparer);
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
        const appended = [...this.#elements, ...collection];
        const retained = appended.length > this.#capacity
            ? appended.slice(appended.length - this.#capacity)
            : appended;
        return new ImmutableCircularQueue<TElement>(this.#capacity, retained, this.comparer);
    }

    /**
     * Removes all elements from this queue.
     * @returns {ImmutableCircularQueue} An empty queue that keeps the same capacity and comparator.
     */
    public override clear(): ImmutableCircularQueue<TElement> {
        return this.isEmpty()
            ? this
            : new ImmutableCircularQueue<TElement>(this.#capacity, [], this.comparer);
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
        return new ImmutableCircularQueue<TElement>(this.#capacity, this.#elements.slice(1), this.comparer);
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
        return this.#elements[0];
    }

    public override isEmpty(): boolean {
        return this.#elements.length === 0;
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
        return this.isEmpty() ? null : this.#elements[0];
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
        return new ImmutableCircularQueue<TElement>(this.#capacity, this.#elements.slice(1), this.comparer);
    }

    public override size(): number {
        return this.#elements.length;
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
        return this.#elements.length;
    }
}
