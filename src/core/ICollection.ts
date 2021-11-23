import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";

export interface ICollection<TElement> extends IEnumerable<TElement> {
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
     * @returns {boolean} Returns true if this collection is changed.
     */
    addAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

    /**
     * Remove all elements from this collection.
     */
    clear(): void;

    /**
     * Check if this collection contains all the elements of the given collection.
     * @param collection The collection whose element will be tested for existence against this collection.
     * @returns {boolean} true if this collection contains all the elements from the given collection, false otherwise.
     */
    containsAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;

    /**
     * Iterates over the collection and runs the given action against every element.
     * @param action The action that will be run against the elements of this collection
     */
    forEach(action: IndexedAction<TElement>): void;

    /**
     * Checks whether this collection is empty or not.
     * @returns {boolean} true if collection is empty
     */
    isEmpty(): boolean;

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
    retainAll<TSource extends TElement>(collection: ICollection<TSource> | Array<TSource>): boolean;

    /**
     * Returns the number of elements in this collection.
     */
    size(): number;
}
