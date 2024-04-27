import {Predicate} from "../shared/Predicate";
import {IReadonlyCollection} from "./IReadonlyCollection";

export interface IImmutableCollection<TElement> extends IReadonlyCollection<TElement> {
    /**
     * Adds the given element to this collection.
     * @param element The element that will be added to this collection.
     * @returns {IImmutableCollection} A new collection with the added element.
     */
    add(element: TElement): IImmutableCollection<TElement>;

    /**
     * Adds all elements from the provided collection to this collection.
     * @param collection The collection whose element will be added to this collection.
     * @returns {IImmutableCollection} A new collection with the added elements.
     */
    addAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;

    /**
     * Removes all elements from this collection.
     * @returns {IImmutableCollection} An empty collection.
     */
    clear(): IImmutableCollection<TElement>;

    /**
     * Removes the given element from this collection.
     * @param element The element that will be removed from this collection.
     * @returns {IImmutableCollection} A new collection without the removed element.
     */
    remove(element: TElement): IImmutableCollection<TElement>;

    /**
     * Removes all elements from this collection that are in the provided collection.
     * @param collection The collection whose elements will be removed from this collection.
     * @returns {IImmutableCollection} A new collection without the removed elements.
     */
    removeAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;

    /**
     * Removes all elements from this collection that satisfy the provided predicate.
     * @param predicate A function that will test each element for a condition.
     * @returns {IImmutableCollection} A new collection without the removed elements.
     */
    removeIf(predicate: Predicate<TElement>): IImmutableCollection<TElement>;

    /**
     * Retains only the elements in this collection that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this collection.
     * @returns {IImmutableCollection} A new collection with only the elements in the specified collection.
     */
    retainAll<TSource extends TElement>(collection: Iterable<TSource>): IImmutableCollection<TElement>;
}