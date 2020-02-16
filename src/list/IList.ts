import { ICollection } from "../core/ICollection";
import { ITransform } from "../core/ITransform";

export interface IList<T> extends ICollection<T>, ITransform<T> {
    /**
     * Retrieves the item at the index.
     * @param  index The index from which the element will be retrieved.
     * @return the item at the given index.
     * @throws 
     *      ArgumentNullException if index is null
     *      ArgumentOutOfRangeException if index is less than 0 or greated than list size.
     */
    get(index: number): T;
    
    /**
     * Finds the index of the given item in the list.
     * @param  item Item whose index to be found.
     * @return Index of the item. If item is not found, returns -1.
     */
    indexOf(item: T): number;

    /**
     * Inserts an item to the given index.
     * @param  index Index that the item will be inserted to.
     * @param  item Item that will be inserted to the given index.
     * @throws ArgumentOutOfRangeException if index is less than zero or index is greater than the size.
     *      Note that if index is zero, the item will always be inserted.
     */
    insert(index: number, item: T): void;

    /**
     * Removes the item at the given index.
     * @param  index The index of the item that will be removed.
     * @throws ArgumentOutOfRangeException if index is less than zer or greater than the size.
     */
    removeAt(index: number): void;
    
    /**
     * Replaces the item at the given index.
     * @param  index Index of the item that will be replaced with the given item.
     * @param  item Item that will replace the old item at the given index.
     * @throws ArgumentOutOfRangeException if index is less than zer or greater than the size.
     */
    set(index: number, item: T): void;
}
