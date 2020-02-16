/**
 * Oct 11th, 2019 Friday
 * This interface is the root interface in the collection hierarchy.
 * It contains the base methods that are used in all of the collection classes.
 */
import { ITransform } from "./ITransform";

export interface ICollection<T> {
    /**
     * Adds an item to the collection
     * @param  item Item that is to be added to the collection.
     * @return true if item is added, false otherwise.
     */
    add(item: T): boolean;
    
    /**
     * Removes all items from the collection
     */
    clear(): void;

    /**
     * Checks if the given item exists in the collection. 
     * @param  item Item whose presence is to be checked.
     * @return true if item is in the collection, false otherwise.
     */
    contains(item: T): boolean;

    /**
     * Checks whether the collection is empty or not.
     * @return true if the collection is empty, false otherwise.
     */
    isEmpty(): boolean;

    /**
     * Removes the given item from the collection.
     * @param  item Item that is to be removed from the collection.
     * @return true if item is removed from the collection, false otherwise.
     */
    remove(item: T): boolean;

    /**
     * Returns the size of the collection.
     * @return Size of the collection.
     */
    size(): number;

    /**
     * Returns an array containing all of the items in the collection.
     * @return an array that contains all of the items of this collection.
     */
    toArray(): T[];
}
