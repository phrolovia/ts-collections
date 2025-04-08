import { AbstractImmutableCollection, IImmutableCollection, Stack } from "../imports";
import { EqualityComparator } from "../shared/EqualityComparator";
import { NoElementsException } from "../shared/NoElementsException";

export class ImmutableStack<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #stack: Stack<TElement>;

    private constructor(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>) {
        super(comparator);
        this.#stack = new Stack(iterable, comparator);
    }

    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: EqualityComparator<TElement>): ImmutableStack<TElement> {
        return new ImmutableStack(iterable, comparator);
    }
    
    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#stack;
    }

    /**
     * Adds the given element to this stack.
     * @template TElement The type of elements in the stack.
     * @param element The element that will be added to this stack.
     * @returns {ImmutableStack} A new stack with the added element.
     */
    public override add(element: TElement): ImmutableStack<TElement> {
        return new ImmutableStack(this.#stack.prepend(element), this.comparer);
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
        return new ImmutableStack([...this.#stack, ...collection], this.comparer);
    }

    /**
     * Removes all elements from this stack.
     * @returns {ImmutableStack} An empty stack.
     */
    public override clear(): IImmutableCollection<TElement> {
        return new ImmutableStack([], this.comparer);
    }

    /**
     * Retrieves but does not remove the element at the top of the stack.
     * Unlike {@link top}, this method returns null if the stack is empty.
     * @template TElement The type of elements in the stack.
     * @returns {TElement | null} The top of the stack or null if the stack is empty.
     */
    public peek(): TElement | null {
        return this.#stack.peek();
    }

    /**
     * Removes the element at the top of the stack and returns the new stack.
     * @template TElement The type of elements in the stack.
     * @returns {ImmutableStack} A new stack with the top element removed.
     */
    public pop(): ImmutableStack<TElement> {
        return new ImmutableStack(this.#stack.reverse().skipLast(1), this.comparer);
    }

    /**
     * Adds the given element to this stack.
     * @template TElement The type of elements in the stack.
     * @param element The element that will be added to this stack.
     * @returns {ImmutableStack} A new stack with the added element.
     */
    public push(element: TElement): ImmutableStack<TElement> {
        return new ImmutableStack(this.#stack.reverse().append(element), this.comparer);
    }

    public override size(): number {
        return this.#stack.size();
    }

    /**
     * Retrieves but does not remove the element at the top of the stack.
     * Unlike {@link peek}, this method throws an error if the stack is empty.
     * @template TElement The type of elements in the stack.
     * @returns {TElement} The top of the stack.
     * @throws {Error} If the stack is empty.
     */
    public top(): TElement {
        if (this.#stack.isEmpty()) {
            throw new NoElementsException();
        }
        return this.#stack.peek() as TElement;
    }

    public override get comparator(): EqualityComparator<TElement> {
        return this.comparer;
    }

    public override get length(): number {
        return this.#stack.length;
    }
}
