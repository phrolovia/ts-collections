import { AbstractCollection, Heap } from "../imports";
import { Comparators } from "../shared/Comparators";
import { ErrorMessages } from "../shared/ErrorMessages";
import { OrderComparator } from "../shared/OrderComparator";

export class PriorityQueue<TElement> extends AbstractCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #queue: Heap<TElement>;

    public constructor(comparator?: OrderComparator<TElement>) {
        super();
        this.#comparator = comparator ?? Comparators.orderComparator;
        this.#queue = new Heap(this.#comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#queue;
    }

    /**
     * Adds an element to the queue.
     * @template TElement The type of elements in the queue.
     * @param element The element to add.
     * @returns true
     */
    public override add(element: TElement): boolean {
        return this.#queue.add(element);
    }

    /**
     * Clears the queue.
     */
    public override clear(): void {
        this.#queue.clear();
    }

    public override contains(element: TElement): boolean {
        return this.#queue.contains(element);
    }

    /**
     * Retrieves and removes the element at the beginning of the queue.
     * Unlike {@link poll}, this method throws an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
     * @throws {Error} If the queue is empty.
     */
    public dequeue(): TElement {
        if (this.#queue.isEmpty()) {
            throw new Error(ErrorMessages.NoElements);
        }
        return this.#queue.poll() as TElement;
    }

    /**
     * Adds an element to the queue.
     * @template TElement The type of elements in the queue.
     * @param element The element to add.
     */
    public enqueue(element: TElement): void {
        this.#queue.add(element);
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
     * @throws {Error} If the queue is empty.
     */
    public front(): TElement {
        if (this.#queue.isEmpty()) {
            throw new Error(ErrorMessages.NoElements);
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
        return this.#queue.isEmpty() ? null : this.#queue.peek();
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

    public size(): number {
        return this.#queue.size();
    }

    public override get length(): number {
        return this.#queue.size();
    }
}