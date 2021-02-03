import {ICollection} from "../../imports";
import {OrderComparator} from "../shared/OrderComparator";

export interface IList<TElement> extends ICollection<TElement> {

    /**
     * Adds the given element to the specified index of this list.
     * @param element The element that will be added to this list.
     * @param index The index that the element will be added to.
     * @returns {boolean} true if the element is added to the list.
     * @throws {Error} If the index is out of bounds.
     */
    addAt(element: TElement, index: number): boolean;

    /**
     * Adds all of the elements from the given collection or array to this list.
     * @param collection The collection or array whose elements will be added to this list.
     * @returns {boolean} true if this list is modified as a result.
     */
    addAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;

    /**
     * Returns an IterableIterator that yields a tuple of [index, element].
     * <pre>
     *     <code>
     *          for (const [index, element] of list.entries()) {
     *             //
     *          }
     *     </code>
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
     * Finds and returns the index of the first occurrence of the given element.
     * @param element The element whose index will be found.
     * @returns the index of the given element. -1 if item is not found.
     */
    indexOf(element: TElement): number;

    /**
     * Finds and returns the index of the last occurrence of the given element.
     * @param element The element whose index will be found.
     * @returns The index of the given element. -1 if item is not found.
     */
    lastIndexOf(element: TElement): number;

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
