import {AbstractCollection, LinkedList} from "../imports.ts";
import {EqualityComparator} from "../shared/EqualityComparator";
import {ErrorMessages} from "../shared/ErrorMessages";

export class Stack<TElement> extends AbstractCollection<TElement> {
    private readonly stack: LinkedList<TElement>;

    public constructor(iterable: Iterable<TElement> = [], comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.stack = new LinkedList<TElement>(iterable, comparator);
        this.updateLength();
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.stack;
    }

    /**
     * Adds an element to the top of the stack.
     * @param element The element to add.
     */
    public override add(element: TElement): boolean {
        this.stack.addFirst(element);
        this.updateLength();
        return true;
    }

    public override clear() {
        this.stack.clear();
        this.updateLength();
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link top}, this method returns null if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue or null if the queue is empty.
     */
    public peek(): TElement | null {
        if (this.stack.isEmpty()) {
            return null;
        }
        return this.stack.peek();
    }

    /**
     * Retrieves and removes the element at the beginning of the queue.
     * @template TElement The type of elements in the queue.
     * @returns {TElement | null} The head of the queue, or null if the queue is empty.
     * @throws {Error} If the queue is empty.
     */
    public pop(): TElement | null {
        const result = this.stack.removeFirst();
        this.updateLength();
        return result;
    }

    /**
     * Adds an element to the top of the stack.
     * @param element The element to add.
     */
    public push(element: TElement): void {
        this.stack.addFirst(element);
        this.updateLength();
    }

    public override size(): number {
        return this.stack.size();
    }

    /**
     * Retrieves but does not remove the element at the beginning of the queue.
     * Unlike {@link peek}, this method throws an error if the queue is empty.
     * @template TElement The type of elements in the queue.
     * @returns {TElement} The head of the queue.
     */
    public top(): TElement {
        if (this.stack.isEmpty()) {
            throw new Error(ErrorMessages.NoElements);
        }
        return this.stack.peek() as TElement;
    }
}