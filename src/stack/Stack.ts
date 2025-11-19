import { reverse } from "../enumerator/functions/reverse";
import { AbstractCollection } from "../core/AbstractCollection";
import { LinkedList } from "../list/LinkedList";
import { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";
import { registerStackFactory } from "../enumerator/Enumerator";

export class Stack<TElement> extends AbstractCollection<TElement> {
    readonly #stack: LinkedList<TElement>;

    public constructor(iterable: Iterable<TElement> = [], comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#stack = new LinkedList<TElement>(reverse(iterable), comparator);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#stack;
    }

    /**
     * Adds an element to the top of the stack.
     * @param element The element to add.
     */
    public override add(element: TElement): boolean {
        this.#stack.addFirst(element);
        return true;
    }

    public override clear() {
        this.#stack.clear();
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link top}, this method returns null if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue or null if the queue is empty.
     */
    public peek(): TElement | null {
        if (this.#stack.isEmpty()) {
            return null;
        }
        return this.#stack.peek();
    }

    /**
     * Retrieves and removes the element at the beginning of the queue.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue, or null if the queue is empty.
     * @throws {Error} If the queue is empty.
     */
    public pop(): TElement | null {
        return this.#stack.removeFirst();
    }

    /**
     * Adds an element to the top of the stack.
     * @param element The element to add.
     */
    public push(element: TElement): void {
        this.#stack.addFirst(element);
    }

    public override size(): number {
        return this.#stack.size();
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
     */
    public top(): TElement {
        if (this.#stack.isEmpty()) {
            throw new NoElementsException();
        }
        return this.#stack.peek() as TElement;
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.#stack.comparator;
    }

    public override get length(): number {
        return this.#stack.length;
    }
}

registerStackFactory(<TElement>(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): Stack<TElement> => {
    return new Stack(iterable, comparator);
});
