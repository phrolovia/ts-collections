import { Predicate } from "../shared/Predicate";
import { IImmutableCollection } from "./IImmutableCollection";

export interface IRandomAccessImmutableCollection<TElement> extends IImmutableCollection<TElement> {
    /**
     * Removes the given element from this collection.
     * @param element The element that will be removed from this collection.
     * @returns {IImmutableCollection} A new collection without the removed element.
     */
    remove(element: TElement): IRandomAccessImmutableCollection<TElement>;

    /**
     * Removes all elements from this collection that are in the provided collection.
     * @param collection The collection whose elements will be removed from this collection.
     * @returns {IImmutableCollection} A new collection without the removed elements.
     */
    removeAll<TSource extends TElement>(collection: Iterable<TSource>): IRandomAccessImmutableCollection<TElement>;

    /**
     * Removes all elements from this collection that satisfy the provided predicate.
     * @param predicate A function that will test each element for a condition.
     * @returns {IImmutableCollection} A new collection without the removed elements.
     */
    removeIf(predicate: Predicate<TElement>): IRandomAccessImmutableCollection<TElement>;

    /**
     * Retains only the elements in this collection that are contained in the specified collection.
     * @param collection The collection whose elements will be retained in this collection.
     * @returns {IImmutableCollection} A new collection with only the elements in the specified collection.
     */
    retainAll<TSource extends TElement>(collection: Iterable<TSource>): IRandomAccessImmutableCollection<TElement>;
}