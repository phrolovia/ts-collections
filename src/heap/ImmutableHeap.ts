import { AbstractImmutableCollection } from "../core/AbstractImmutableCollection";
import { Comparators } from "../shared/Comparators";
import { OrderComparator } from "../shared/OrderComparator";
import { Predicate } from "../shared/Predicate";
import { Heap } from "./Heap";

/**
 * An immutable binary heap that returns a new instance whenever it is modified.
 * By default, this heap behaves as a min-heap, but you can provide a custom comparator
 * to change the ordering (for example to create a max-heap).
 */
export class ImmutableHeap<TElement> extends AbstractImmutableCollection<TElement> {
    readonly #comparator: OrderComparator<TElement>;
    readonly #heap: Heap<TElement>;

    private constructor(iterable?: Iterable<TElement>, comparator?: OrderComparator<TElement>) {
        super();
        this.#comparator = comparator ?? Comparators.orderComparator;
        this.#heap = new Heap(this.#comparator, iterable ?? []);
    }

    /**
     * Creates a new immutable heap.
     * @template TElement The type of elements stored in the heap.
     * @param iterable Optional source elements that will seed the heap.
     * @param comparator Optional comparator that controls the heap ordering.
     * @returns {ImmutableHeap<TElement>} A new heap instance containing the supplied elements.
     */
    public static create<TElement>(iterable?: Iterable<TElement>, comparator?: OrderComparator<TElement>): ImmutableHeap<TElement> {
        return new ImmutableHeap(iterable, comparator);
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
        const newHeap = new Heap(this.#comparator, this.#heap);
        newHeap.add(element);
        return new ImmutableHeap(newHeap, this.#comparator);
    }

    /**
     * Adds all elements from the provided collection to this heap.
     * @template TSource The type of elements in the collection.
     * @param collection The collection whose elements will be added to this heap.
     * @returns {ImmutableHeap<TElement>} A new heap with the added elements, or this heap if the collection was empty.
     */
    public override addAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableHeap<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        let changed = false;
        for (const element of collection) {
            newHeap.add(element);
            changed = true;
        }
        return changed ? new ImmutableHeap(newHeap, this.#comparator) : this;
    }

    /**
     * Removes all elements from this heap.
     * @returns {ImmutableHeap<TElement>} An empty heap with the same comparator.
     */
    public override clear(): ImmutableHeap<TElement> {
        return this.isEmpty() ? this : new ImmutableHeap([], this.#comparator);
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
        return this.#heap.containsAll(collection);
    }

    /**
     * Determines whether the heap has no elements.
     * @returns {boolean} True if the heap is empty, false otherwise.
     */
    public override isEmpty(): boolean {
        return this.#heap.isEmpty();
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
        if (this.isEmpty()) {
            return this;
        }
        const newHeap = new Heap(this.#comparator, this.#heap);
        newHeap.poll();
        return new ImmutableHeap(newHeap, this.#comparator);
    }

    /**
     * Removes the specified element from this heap.
     * @param element The element that will be removed.
     * @returns {ImmutableHeap<TElement>} A new heap without the element, or this heap if the element was not found.
     */
    public remove(element: TElement): ImmutableHeap<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        const removed = newHeap.remove(element);
        return removed ? new ImmutableHeap(newHeap, this.#comparator) : this;
    }

    /**
     * Removes all elements from this heap that are contained in the specified collection.
     * @template TSource The type of elements that will be removed.
     * @param collection The collection of elements to remove.
     * @returns {ImmutableHeap<TElement>} A new heap without the specified elements, or this heap if no elements were removed.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): ImmutableHeap<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        const removed = newHeap.removeAll(collection);
        return removed ? new ImmutableHeap(newHeap, this.#comparator) : this;
    }

    /**
     * Removes all elements from this heap that satisfy the specified predicate.
     * @param predicate The predicate used to determine which elements should be removed.
     * @returns {ImmutableHeap<TElement>} A new heap without the matching elements, or this heap if no elements were removed.
     */
    public removeIf(predicate: Predicate<TElement>): ImmutableHeap<TElement> {
        const newHeap = new Heap(this.#comparator, this.#heap);
        const removed = newHeap.removeIf(predicate);
        return removed ? new ImmutableHeap(newHeap, this.#comparator) : this;
    }

    public override size(): number {
        return this.#heap.size();
    }

    /**
     * Gets the comparator that defines the ordering of the heap.
     * @returns {OrderComparator<TElement>} The comparator used by this heap.
     */
    public override get comparator(): OrderComparator<TElement> {
        return this.#comparator;
    }

    public override get length(): number {
        return this.#heap.length;
    }
}
