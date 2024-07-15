import { IEnumerable } from "../enumerator/IEnumerable";
import { EqualityComparator } from "../shared/EqualityComparator";
import { IndexedAction } from "../shared/IndexedAction";
import { OrderComparator } from "../shared/OrderComparator";
import { Selector } from "../shared/Selector";

export interface IReadonlyCollection<TElement> extends IEnumerable<TElement> {
    /**
     * Returns the number of element in this collection.
     * @returns {number} The number of elements in this collection.
     */
    get length(): number;

    /**
     * Returns the current comparator used by this collection.
     * @template TElement The type of the elements in the collection.
     * @returns {EqualityComparator<TElement> | OrderComparator<TElement>} The current comparator used by this collection.
     */
    get comparator(): EqualityComparator<TElement> | OrderComparator<TElement>;

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
     * @returns {number} The number of elements in this collection.
     */
    size(): number;

    /**
     * Returns a string representation of this collection.
     * @returns {string} A string representation of this collection.
     */
    toString(): string;

    /**
     * Returns a string representation of this collection.
     * @param separator The separator that will be used to separate the elements of this collection.
     * @returns {string} A string representation of this collection.
     */
    toString(separator?: string): string;

    /**
     * Returns a string representation of this collection.
     * @param separator The separator that will be used to separate the elements of this collection.
     * @param selector The selector that will be used to select the property that will be used to generate the string representation of this collection.
     * @returns {string} A string representation of this collection.
     */
    toString(separator?: string, selector?: Selector<TElement, string>): string;
}