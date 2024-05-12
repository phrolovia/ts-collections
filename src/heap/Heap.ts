import { AbstractRandomAccessCollection, Collections, List } from "../imports.ts";
import { Comparators } from "../shared/Comparators.ts";
import { OrderComparator } from "../shared/OrderComparator.ts";
import { Predicate } from "../shared/Predicate.ts";

export class Heap<TElement> extends AbstractRandomAccessCollection<TElement> {
    readonly #comparator: OrderComparator<TElement> = Comparators.orderComparator;
    readonly #heap: List<TElement> = new List<TElement>();

    public constructor();
    public constructor(comparator: OrderComparator<TElement>);
    public constructor(comparator: OrderComparator<TElement> | null, iterable: Iterable<TElement>);
    public constructor(comparator?: OrderComparator<TElement> | null, iterable?: Iterable<TElement>) {
        super((e1, e2) => (comparator ?? this.#comparator)(e1, e2) === 0);
        this.#comparator = comparator ?? this.#comparator;
        if (iterable) {
            this.addAll(iterable);
        }
    }

    * [Symbol.iterator](): Iterator<TElement> {
        yield* this.#heap;
    }

    /**
     * Adds an element to the heap.
     * @param element The element to add.
     * @returns true
     */
    public add(element: TElement): boolean {
        this.#heap.add(element);
        this.heapifyUp();
        return true;
    }

    /**
     * Clears the heap.
     */
    public clear(): void {
        this.#heap.clear();
    }

    public override contains(element: TElement): boolean {
        return this.#heap.contains(element);
    }

    public override containsAll(collection: Iterable<TElement>): boolean {
        return this.#heap.containsAll(collection);
    }

    public override isEmpty(): boolean {
        return this.#heap.isEmpty();
    }

    /**
     * Retrieves the element at the root of the heap without removing it.
     */
    public peek(): TElement {
        return this.#heap.get(0);
    }

    /**
     * Retrieves the element at the root of the heap and removes it.
     * @returns The element at the root of the heap, or null if the heap is empty.
     */
    public poll(): TElement | null {
        if (this.isEmpty()) {
            return null;
        }
        const root = this.#heap.get(0);
        const lastElementIndex = this.size() - 1;
        if (lastElementIndex > 0) {
            Collections.swap(this.#heap, 0, lastElementIndex);
        }
        this.#heap.removeAt(lastElementIndex);
        this.heapifyDown();
        return root;
    }

    /**
     * Removes the specified element from the heap.
     * @param element The element to remove.
     * @returns true if the element was removed; otherwise, false.
     */
    public remove(element: TElement): boolean {
        const index = this.#heap.indexOf(element);
        if (index < 0) {
            return false;
        }
        const lastElementIndex = this.size() - 1;
        Collections.swap(this.#heap, index, lastElementIndex);
        this.#heap.removeAt(lastElementIndex);
        this.heapifyDown(index);
        return true;
    }

    /**
     * Removes all elements in the specified collection from the heap.
     * @param collection The collection of elements to remove.
     * @returns true if any elements were removed; otherwise, false.
     */
    public removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean {
        const result = this.#heap.removeAll(collection);
        this.heapifyDown();
        return result;
    }

    /**
     * Removes all elements from the heap that satisfy the specified predicate.
     * @param predicate The predicate used to determine which elements to remove.
     * @returns true if any elements were removed; otherwise, false.
     */
    public override removeIf(predicate: Predicate<TElement>): boolean {
        const result = this.#heap.removeIf(predicate);
        this.heapifyDown();
        return result;
    }

    /**
     * Returns the number of elements in the heap.
     * @returns The number of elements in the heap.
     */
    public size(): number {
        return this.#heap.size();
    }

    /**
     * Returns the number of elements in the heap.
     * @returns The number of elements in the heap.
     */
    public get length(): number {
        return this.#heap.length;
    }

    private getLeftChildIndex(index: number): number {
        return 2 * index + 1;
    }

    private getLeftChildValue(index: number): TElement | null {
        return this.hasLeftChild(index) ? this.#heap.get(this.getLeftChildIndex(index)) : null;
    }

    private getParentIndex(index: number): number {
        return Math.floor((index - 1) / 2);
    }

    private getParentValue(index: number): TElement | null {
        return index < this.size() && this.getParentIndex(index) >= 0 ? this.#heap.get(this.getParentIndex(index)) : null;
    }

    private getRightChildIndex(index: number): number {
        return 2 * index + 2;
    }

    private getRightChildValue(index: number): TElement | null {
        return this.hasRightChild(index) ? this.#heap.get(this.getRightChildIndex(index)) : null;
    }

    private hasLeftChild(index: number): boolean {
        return this.getLeftChildIndex(index) < this.size();
    }

    private hasRightChild(index: number): boolean {
        return this.getRightChildIndex(index) < this.size();
    }

    private heapifyDown(index: number = 0): void {
        while (this.hasLeftChild(index)) {
            let smallerChildIndex = this.getLeftChildIndex(index);
            if (this.hasRightChild(index) && this.#comparator(this.getRightChildValue(index) as TElement, this.getLeftChildValue(index) as TElement) < 0) {
                smallerChildIndex = this.getRightChildIndex(index);
            }
            if (this.#comparator(this.#heap.get(index), this.#heap.get(smallerChildIndex)) <= 0) {
                break;
            }
            Collections.swap(this.#heap, index, smallerChildIndex);
            index = smallerChildIndex;
        }
    }

    private heapifyUp(index: number = this.size() - 1): void {
        while (index > 0 && this.#comparator(this.getParentValue(index) as TElement, this.#heap.get(index)) > 0) {
            Collections.swap(this.#heap, index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }
}