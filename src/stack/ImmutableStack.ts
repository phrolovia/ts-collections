import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import type { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";
import { registerImmutableStackFactory } from "../enumerator/Enumerator";

// A node of a singly linked list. Stacks share their tails, so push and pop are O(1).
interface StackNode<TElement> {
    readonly next: StackNode<TElement> | null;
    readonly value: TElement;
}

export class ImmutableStack<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #size: number;
    readonly #top: StackNode<TElement> | null;

    private constructor(top: StackNode<TElement> | null, size: number, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#top = top;
        this.#size = size;
    }

    /**
     * Creates a stack from the given elements. The last element of the iterable becomes the top of the stack.
     */
    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        const [top, size] = ImmutableStack.#pushAll(null, 0, iterable ?? []);
        return new ImmutableStack(top, size, comparator);
    }

    static #pushAll<TElement>(top: StackNode<TElement> | null, size: number, elements: Iterable<TElement>): [StackNode<TElement> | null, number] {
        for (const value of elements) {
            top = { value, next: top };
            ++size;
        }
        return [top, size];
    }

    * [Symbol.iterator](): Iterator<TElement> {
        for (let node = this.#top; node !== null; node = node.next) {
            yield node.value;
        }
    }

    /**
     * Adds the given element to the top of this stack. This method is equivalent to {@link push}.
     * @template TElement The type of elements in the stack.
     * @param element The element that will be added to this stack.
     * @returns {ImmutableStack} A new stack with the added element.
     */
    public override add(element: TElement): ImmutableStack<TElement> {
        return this.push(element);
    }

    /**
     * Adds all elements from the provided collection to this stack.
     * The elements of the collection are added in the reverse order of the collection.
     * For example, if the collection is [1, 2, 3], the stack will contain [3, 2, 1], with 3 at the top.
     * @template TElement The type of elements in the stack.
     * @param collection The collection whose element will be added to this stack.
     * @returns {ImmutableStack} A new stack with the added elements.
     */
    public override addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableStack<TElement> {
        const [top, size] = ImmutableStack.#pushAll(this.#top, this.#size, collection);
        return top === this.#top ? this : new ImmutableStack(top, size, this.comparer);
    }

    /**
     * Removes all elements from this stack.
     * @returns {ImmutableStack} An empty stack.
     */
    public override clear(): ImmutableStack<TElement> {
        return new ImmutableStack<TElement>(null, 0, this.comparer);
    }

    public override isEmpty(): boolean {
        return this.#top === null;
    }

    /**
     * Retrieves but does not remove the element at the top of the stack.
     * Unlike {@link top}, this method returns null if the stack is empty.
     * @template TElement The type of elements in the stack.
     * @returns {TElement | null} The top of the stack or null if the stack is empty.
     */
    public peek(): TElement | null {
        return this.#top === null ? null : this.#top.value;
    }

    /**
     * Removes the element at the top of the stack and returns the new stack.
     * @template TElement The type of elements in the stack.
     * @returns {ImmutableStack} A new stack with the top element removed, or this stack if it is empty.
     */
    public pop(): ImmutableStack<TElement> {
        if (this.#top === null) {
            return this;
        }
        return new ImmutableStack(this.#top.next, this.#size - 1, this.comparer);
    }

    /**
     * Adds the given element to this stack.
     * @template TElement The type of elements in the stack.
     * @param element The element that will be added to this stack.
     * @returns {ImmutableStack} A new stack with the added element.
     */
    public push(element: TElement): ImmutableStack<TElement> {
        return new ImmutableStack({ value: element, next: this.#top }, this.#size + 1, this.comparer);
    }

    /**
     * Replaces all elements in this stack with the elements from the provided collection.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableStack} A new stack containing only the elements from the provided collection.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableStack<TElement> {
        if (collection === this) {
            return this;
        }
        return ImmutableStack.create<TElement>(collection, this.comparer);
    }

    public override size(): number {
        return this.#size;
    }

    /**
     * Retrieves but does not remove the element at the top of the stack.
     * Unlike {@link peek}, this method throws an error if the stack is empty.
     * @template TElement The type of elements in the stack.
     * @returns {TElement} The top of the stack.
     * @throws {Error} If the stack is empty.
     */
    public top(): TElement {
        if (this.#top === null) {
            throw new NoElementsException();
        }
        return this.#top.value;
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#size;
    }
}

registerImmutableStackFactory(<TElement>(iterable: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> => {
    return ImmutableStack.create(iterable, comparator);
});
