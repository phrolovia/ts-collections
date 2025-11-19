import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import { Queue } from "./Queue";
import { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";

export class ImmutableQueue<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #queue: Queue<TElement>;

    private constructor(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#queue = new Queue(iterable, comparator);
    }

    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableQueue<TElement> {
        return new ImmutableQueue(iterable, comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#queue;
    }

    /**
     * Adds the given element to this queue.
     * @template TElement The type of elements in the queue.
     * @param element The element that will be added to this queue.
     * @returns {ImmutableQueue} A new queue with the added element.
     */
    public add(element: TElement): ImmutableQueue<TElement> {
        return new ImmutableQueue([...this.#queue, element], this.comparer);
    }

    /**
     * Adds all elements from the provided collection to this queue.
     * @template TElement The type of elements in the queue.
     * @param collection The collection whose element will be added to this queue.
     * @returns {ImmutableQueue} A new queue with the added elements.
     */
    public addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableQueue<TElement> {
        return new ImmutableQueue([...this.#queue, ...collection], this.comparer);
    }

    /**
     * Removes all elements from this queue.
     * @returns {ImmutableQueue} An empty queue.
     */
    public clear(): ImmutableQueue<TElement> {
        return new ImmutableQueue([], this.comparer);
    }

    /**
     * Removes the element at the front of this queue.
     * @returns {ImmutableQueue} A new queue with the element at the front removed.
     * @throws {Error} Thrown when the queue is empty.
     */
    public dequeue(): ImmutableQueue<TElement> {
        if (this.#queue.isEmpty()) {
            throw new NoElementsException();
        }
        return new ImmutableQueue(this.#queue.skip(1), this.comparer);
    }

    /**
     * Adds an element to the end of this queue. This method is equivalent to {@link add}.
     * @template TElement The type of elements in the queue.
     * @param element The element that will be added to this queue.
     * @returns {ImmutableQueue} A new queue with the added element.
     */
    public enqueue(element: TElement): ImmutableQueue<TElement> {
        return new ImmutableQueue([...this.#queue, element], this.comparer);
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
     */
    public front(): TElement {
        if (this.#queue.isEmpty()) {
            throw new NoElementsException();
        }
        return this.#queue.peek() as TElement;
    }

    public override isEmpty(): boolean {
        return this.#queue.isEmpty();
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link front}, this method returns null if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue or null if the queue is empty.
     */
    public peek(): TElement | null {
        return this.#queue.peek();
    }

    /**
     * Removes the element at the beginning of the queue and returns the new queue.
     * Unlike {@link dequeue}, this method does not throw an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {ImmutableQueue} A new queue with the head removed, or an empty queue if the queue is empty.
     */
    public poll(): ImmutableQueue<TElement> {
        if (this.#queue.isEmpty()) {
            return ImmutableQueue.create([], this.comparer);
        }
        return new ImmutableQueue(this.#queue.skip(1), this.comparer);
    }

    public override size(): number {
        return this.#queue.size();
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#queue.length;
    }
}
