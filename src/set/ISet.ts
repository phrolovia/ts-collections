import type { IRandomAccessCollection } from "../core/IRandomAccessCollection";

export interface ISet<TElement> extends IRandomAccessCollection<TElement> {
    /**
     * Removes all elements in the specified collection from the current set.
     * @param other The collection of items to remove from the set.
     */
    exceptWith(other: Iterable<TElement>): void;

    /**
     * Modifies the current set so that it contains only the elements that are also in the specified collection.
     * @param other
     */
    intersectWith(other: Iterable<TElement>): void;

    /**
     * Determines whether this set is a proper subset of the specified collection.
     * @param other The iterable to compare to this set.
     * @returns true if this set is a proper subset of other; otherwise, false.
     */
    isProperSubsetOf(other: Iterable<TElement>): boolean;

    /**
     * Determines whether this set is a proper superset of the specified collection.
     * @param other The iterable to compare to this set.
     * @returns true if this set is a proper superset of other; otherwise, false.
     */
    isProperSupersetOf(other: Iterable<TElement>): boolean;

    /**
     * Determines whether this set is a subset of the specified collection.
     * @param other The iterable to compare to this set.
     * @returns true if this set is a subset of other; otherwise, false.
     */
    isSubsetOf(other: Iterable<TElement>): boolean;

    /**
     * Determines whether this set is a superset of the specified collection.
     * @param other The iterable to compare to this set.
     * @returns true if this set is a superset of other; otherwise, false.
     */
    isSupersetOf(other: Iterable<TElement>): boolean;

    /**
     * Determines whether this set and the specified collection share common elements.
     * @param other The iterable to compare to this set.
     * @returns true if the set and other share at least one common element; otherwise, false.
     */
    overlaps(other: Iterable<TElement>): boolean;
}
