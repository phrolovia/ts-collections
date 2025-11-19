import type { IEnumerable } from "../enumerator/IEnumerable";
import type { IGroup } from "../enumerator/IGroup";

export interface ILookup<TKey, TElement> extends IEnumerable<IGroup<TKey, TElement>> {
    /**
     * Returns the collection of elements that has the specified key.
     * @param key The key of the desired group.
     * @returns The collection of elements that has the specified key.
     */
    get(key: TKey): IEnumerable<TElement>;

    /**
     * Determines whether a specified key exists in the ILookup<TKey, TElement>.
     * @param key The key to locate in the ILookup<TKey, TElement>.
     * @returns true if key is in the ILookup<TKey, TElement>; otherwise, false.
     */
    hasKey(key: TKey): boolean;

    /**
     * Gets the number of key/value collection pairs in the ILookup<TKey, TElement>.
     * @returns The number of key/value collection pairs in the ILookup<TKey, TElement>.
     */
    size(): number;

    /**
     * Gets the number of elements in the ILookup<TKey, TElement>.
     * @returns The number of elements in the ILookup<TKey, TElement>.
     */
    get length(): number;
}
