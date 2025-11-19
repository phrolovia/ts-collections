import type { IReadonlyCollection } from "../core/IReadonlyCollection";
import type { EqualityComparator } from "../shared/EqualityComparator";

export interface IReadonlyList<TElement> extends IReadonlyCollection<TElement> {
    /**
     * Returns an IterableIterator that yields a tuple of [index, element].
     * <pre>
     *      for (const [index, element] of list.entries())
     * </pre>
     */
    entries(): IterableIterator<[number, TElement]>;

    /**
     * Returns the element at the given index.
     * @param index The index from which the element will be returned.
     * @returns The element at the given index
     */
    get(index: number): TElement;

    /**
     * Returns a shallow copy of a range of elements in the source list.
     * @param index The index at which the range will start.
     * @param count The number of elements in the range.
     * @returns A shallow copy of a range of elements in the source list.
     * @throws {Error} If the index is out of bounds.
     */
    getRange(index: number, count: number): IReadonlyList<TElement>;

    /**
     * Finds and returns the index of the first occurrence of the given element.
     * @param element The element whose index will be found.
     * @param comparator The comparator that will be used to compare for equality.
     * @returns the index of the given element. -1 if item is not found.
     */
    indexOf(element: TElement, comparator?: EqualityComparator<TElement>): number;

    /**
     * Finds and returns the index of the last occurrence of the given element.
     * @param element The element whose index will be found.
     * @param comparator The comparator that will be used to compare for equality.
     * @returns The index of the given element. -1 if item is not found.
     */
    lastIndexOf(element: TElement, comparator?: EqualityComparator<TElement>): number;
}
