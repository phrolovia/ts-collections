import { IReadonlyCollection } from "./IReadonlyCollection";

export interface ICollection<TElement> extends IReadonlyCollection<TElement> {
    /**
     * Adds the element to the collection.
     * @param element The element that will be added to the collection
     * @returns {boolean} true if item is added, false otherwise.
     */
    add(element: TElement): boolean;

    /**
     * Add all items from the provided collection to this collection
     * @param collection The collection whose element will be added
     *                   to this collection.
     * @returns {boolean} true if this collection is changed.
     */
    addAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

    /**
     * Remove all elements from this collection.
     */
    clear(): void;
}
