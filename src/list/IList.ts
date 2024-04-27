import { IRandomAccessCollection, IReadonlyList } from "../imports.ts";
import { OrderComparator } from "../shared/OrderComparator";

export interface IList<TElement> extends IReadonlyList<TElement>, IRandomAccessCollection<TElement> {

    /**
     * Adds the given element to the specified index of this list.
     * @param element The element that will be added to this list.
     * @param index The index that the element will be added to.
     * @returns {boolean} true if the element is added to the list.
     * @throws {Error} If the index is out of bounds.
     */
    addAt(element: TElement, index: number): boolean;

    /**
     * Removes the element at the given index from this list.
     * @param index The index from which the element will be removed.
     * @returns The removed element.
     * @throws {Error} If the index is out of bounds.
     */
    removeAt(index: number): TElement;

    /**
     * Replaces the element at the given index with the given element.
     * @param {number} index The index at which the element will be replaced
     * @param element The element which will replace the element at the given index.
     * @returns The old replaced element
     * @throws {Error} If the index is out of bounds.
     */
    set(index: number, element: TElement): TElement;

    /**
     * Sorts the lists according to the specified comparator.
     * If not specified, the list will be sorted by using the natural ordering of the elements.
     * @param comparator The comparator used to compare the list elements.
     */
    sort(comparator?: OrderComparator<TElement>): void;
}
