import type { IReadonlyCollection } from "./IReadonlyCollection";

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
}
