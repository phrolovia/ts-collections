import {AbstractCollection, LinkedList} from "../../imports";
import {ErrorMessages} from "../shared/ErrorMessages";
import {EqualityComparator} from "../shared/EqualityComparator";

export class Queue<TElement> extends AbstractCollection<TElement> {
    private readonly queue: LinkedList<TElement>;

    public constructor( iterable: Iterable<TElement> = [] as TElement[], comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.queue = new LinkedList<TElement>(iterable, comparator);
        this.updateLength();
    }

    *[Symbol.iterator](): Iterator<TElement> {
        yield* this.queue;
    }

    /**
     * Adds an element to the end of the queue.
     * @param element The element that will be added to the queue.
     * @return true if the element was added to the queue, false otherwise.
     */
    public override add(element: TElement): boolean {
        const result = this.queue.add(element);
        this.updateLength();
        return result;
    }

    public override clear(): void {
        this.queue.clear();
        this.updateLength();
    }

    public override contains(element: TElement): boolean {
        return this.queue.contains(element);
    }

    /**
     * Retrieves and returns the element at the beginning of the queue.
     * Unlike {@link poll}, this method does not return null if the queue is empty.
     * Instead, it throws an exception.
     * @returns {TElement} The head of the queue.
     * @throws {Error} If the queue is empty.
     */
    public dequeue(): TElement {
        if (this.queue.isEmpty()) {
            throw new Error(ErrorMessages.NoElements);
        }
        const result = this.queue.poll();
        this.updateLength();
        return result;
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @returns {TElement} The head of the queue.
     */
    public element(): TElement {
        if (this.queue.isEmpty()) {
            throw new Error(ErrorMessages.NoElements);
        }
        return this.queue.peek();
    }

    /**
     * Adds an element to the end of the queue.
     * @param element The element that will be added to the queue.
     */
    public enqueue(element: TElement): void {
        this.queue.add(element);
        this.updateLength();
    }

    public override isEmpty(): boolean {
        return this.queue.isEmpty();
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link element}, this method returns null if the queue is empty.
     * @returns {TElement | null} The head of the queue or null if the queue is empty.
     */
    public peek(): TElement | null {
        if (this.queue.isEmpty()) {
            return null;
        }
        return this.queue.peek();
    }

    /**
     * Retrieves and removes the element at the beginning of the queue.
     * Unlike {@link dequeue}, this method does not throw an error if the queue is empty.
     * @returns {TElement | null} The head of the queue, or null if the queue is empty.
     */
    public poll(): TElement | null {
        const result = this.queue.poll();
        this.updateLength();
        return result;
    }

    public override size(): number {
        return this.queue.size();
    }
}