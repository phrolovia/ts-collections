import {Predicate} from "../shared/Predicate";
import {IEnumerable} from "../../imports";
import {IndexedAction} from "../shared/IndexedAction";

export interface ICollection<TElement> extends IEnumerable<TElement> {
    /**
     * Returns the number of element in this collection.
     */
    readonly length: number;

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
    containsAll<TSource extends TElement>(collection: Iterable<TSource>): boolean;

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
     * Returns the number of elements in this collection.
     */
    size(): number;
}
