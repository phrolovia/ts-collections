import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import { Comparators } from "../shared/Comparators";
import type { OrderComparator } from "../shared/OrderComparator";
import type { Predicate } from "../shared/Predicate";
import { PersistentHeap } from "../shared/internal/PersistentHeap";
import { contains } from "../enumerator/functions/contains";

/**
 * An immutable binary heap that returns a new instance whenever it is modified.
 * By default, this heap behaves as a min-heap, but you can provide a custom comparator
 * to change the ordering (for example to create a max-heap).
 */
export class ImmutableHeap<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #heap: PersistentHeap<TElement>;

    private constructor(heap: PersistentHeap<TElement>, comparator: OrderComparator<TElement>) {
        super();
        this.#comparator = comparator;
        this.#heap = heap;
    }

    /**
     * Creates a new immutable heap.
     * @template TElement The type of elements stored in the heap.
     * @param iterable Optional source elements that will seed the heap.
     * @param comparator Optional comparator that controls the heap ordering.
     * @returns {ImmutableHeap<TElement>} A new heap instance containing the supplied elements.
     */
    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: OrderComparator<TElement>): ImmutableHeap<TElement> {
        const order = comparator ?? Comparators.orderComparator;
        return new ImmutableHeap(PersistentHeap.create(iterable ?? [], order), order);
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#heap;
    }

    /**
     * Adds the given element to this heap.
     * @param element The element that will be added to this heap.
     * @returns {ImmutableHeap<TElement>} A new heap with the added element.
     */
    public override add(element: TElement): ImmutableHeap<TElement> {
        return this.#with(this.#heap.add(element));
    }

    /**
     * Adds all elements from the provided collection to this heap.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will be added to this heap.
     * @returns {ImmutableHeap<TElement>} A new heap with the added elements, or this heap if the collection was empty.
     */
    public override addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableHeap<TElement> {
        return this.#with(this.#heap.addAll(collection));
    }

    /**
     * Removes all elements from this heap.
     * @returns {ImmutableHeap<TElement>} An empty heap with the same comparator.
     */
    public override clear(): ImmutableHeap<TElement> {
        return this.isEmpty() ? this : this.#with(PersistentHeap.create([], this.#comparator));
    }

    /**
     * Checks if the heap contains the specified element.
     * @param element The element to locate.
     * @returns {boolean} True if the element is present; otherwise, false.
     */
    public override contains(element: TElement): boolean {
        return this.#heap.contains(element);
    }

    /**
     * Checks if the heap contains all elements from the specified collection.
     * @template TSource The type of elements in the target collection.
     * @param collection The collection whose elements will be checked for membership.
     * @returns {boolean} True if all elements are present; otherwise, false.
     */
    public override containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        for (const element of collection) {
            if (!this.#heap.contains(element)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determines whether the heap has no elements.
     * @returns {boolean} True if the heap is empty, false otherwise.
     */
    public override isEmpty(): boolean {
        return this.#heap.size === 0;
    }

    /**
     * Retrieves but does not remove the element at the root of the heap.
     * @returns {TElement | null} The root element, or null if the heap is empty.
     */
    public peek(): TElement | null {
        return this.#heap.peek();
    }

    /**
     * Removes the element at the root of the heap.
     * @returns {ImmutableHeap<TElement>} A new heap without the root element, or this heap if it was empty.
     */
    public poll(): ImmutableHeap<TElement> {
        return this.#with(this.#heap.poll());
    }

    /**
     * Removes the specified element from this heap.
     * @param element The element that will be removed.
     * @returns {ImmutableHeap<TElement>} A new heap without the element, or this heap if the element was not found.
     */
    public remove(element: TElement): ImmutableHeap<TElement> {
        return this.#with(this.#heap.remove(element));
    }

    /**
     * Removes all elements from this heap that are contained in the specified collection.
     * @template TSource The type of elements that will be removed.
     * @param collection The collection of elements to remove.
     * @returns {ImmutableHeap<TElement>} A new heap without the specified elements, or this heap if no elements were removed.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableHeap<TElement> {
        return this.#with(this.#heap.removeWhere(e => contains(collection, e)));
    }

    /**
     * Removes all elements from this heap that satisfy the specified predicate.
     * @param predicate The predicate used to determine which elements should be removed.
     * @returns {ImmutableHeap<TElement>} A new heap without the matching elements, or this heap if no elements were removed.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableHeap<TElement> {
        return this.#with(this.#heap.removeWhere(predicate));
    }

    /**
     * Replaces all elements in this heap with the elements from the provided collection.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will replace the current elements.
     * @returns {ImmutableHeap<TElement>} A new heap containing only the elements from the provided collection.
     */
    public override reset<TSource extends TElement>(collection: Iterable<TSource>): ImmutableHeap<TElement> {
        if (collection === this) {
            return this;
        }
        return this.#with(PersistentHeap.create<TElement>(collection, this.#comparator));
    }

    public override size(): number {
        return this.#heap.size;
    }

    /**
     * Gets the comparator that defines the ordering of the heap.
     * @returns {OrderComparator<TElement>} The comparator used by this heap.
     */
    #with(heap: PersistentHeap<TElement>): ImmutableHeap<TElement> {
        return heap === this.#heap ? this : new ImmutableHeap(heap, this.#comparator);
    }

    public override get comparator(): OrderComparator<TElement> {
        return this.#comparator;
    }

    public override get length(): number {
        return this.#heap.size;
    }
}
