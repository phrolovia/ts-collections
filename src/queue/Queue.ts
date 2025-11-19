import { AbstractCollection } from "../core/AbstractCollection";
import { LinkedList } from "../list/LinkedList";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";
import { registerQueueFactory } from "../enumerator/Enumerator";

export class Queue<TElement> extends AbstractCollection<TElement> {
    readonly #queue: LinkedList<TElement>;

    public constructor(iterable: Iterable<TElement> = [] as TElement[], comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#queue = new LinkedList<TElement>(iterable, comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#queue;
    }

    /**
     * Adds an element to the end of the queue.
     * @param element The element that will be added to the queue.
     * @return true if the element was added to the queue, false otherwise.
     */
    public override add(element: TElement): boolean {
        return this.#queue.add(element);
    }

    public override clear(): void {
        this.#queue.clear();
    }

    public override contains(element: TElement, comparator?: EqualityComparator<TElement>): boolean {
        return this.#queue.contains(element, comparator);
    }

    /**
     * Retrieves and returns the element at the beginning of the queue.
     * Unlike {@link poll}, this method does not return null if the queue is empty.
     * Instead, it throws an exception.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
     * @throws {Error} If the queue is empty.
     */
    public dequeue(): TElement {
        if (this.#queue.isEmpty()) {
            throw new NoElementsException();
        }
        const result = this.#queue.poll();
        return result as TElement;
    }

    /**
     * Adds an element to the end of the queue.
     * @param element The element that will be added to the queue.
     */
    public enqueue(element: TElement): void {
        this.#queue.add(element);
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
        if (this.#queue.isEmpty()) {
            return null;
        }
        return this.#queue.peek();
    }

    /**
     * Retrieves and removes the element at the beginning of the queue.
     * Unlike {@link dequeue}, this method does not throw an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue, or null if the queue is empty.
     */
    public poll(): TElement | null {
        return this.#queue.poll();
    }

    public override size(): number {
        return this.#queue.size();
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.#queue.comparator
    }

    public override get length(): number {
        return this.#queue.length;
    }
}

registerQueueFactory(<TElement>(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): Queue<TElement> => {
    return new Queue(iterable, comparator);
});
