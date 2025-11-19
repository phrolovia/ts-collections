import type { Predicate } from "../shared/Predicate";
import type { ICollection } from "./ICollection";

/**
 * Represents a collection of objects whose elements can be accessed without restriction.
 */
export interface IRandomAccessCollection<TElement> extends ICollection<TElement> {
    /**
     * Removes the given element from this collection. Comparison is made by the collection's current comparator.
     * @param element The element that will be removed from the collection.
     * @returns true if the element is removed from the collection, false otherwise.
     */
    remove(element: TElement): boolean;

    /**
     * Removes all the elements of the given collection or array from this collection.
     * @param collection The collection or array whose elements will be removed from this collection.
     * @returns true if this collection is modified as a result.
     */
    removeAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

    /**
     * Removes all the elements that satisfy the given predicate from this collection.
     * @param predicate The predicate method against which the elements of this collection will be tested.
     * @returns {boolean} true if this collection is modified as a result.
     */
    removeIf(predicate: Predicate<TElement>): boolean;

    /**
     * Removes all the elements that do not exist in the given collection or array.
     * @param collection The collection or array whose elements will remain in this collection.
     * @returns {boolean} true if this collection is modified as a result.
     */
    retainAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;
}
