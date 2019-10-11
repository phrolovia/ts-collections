import { ICollection } from "../core/ICollection";

export type TraverseType = "INORDER" | "PREORDER" | "POSTORDER";
export interface ITree<T> extends ICollection<T> {
    
    /**
     * Deletes the given item from the tree.
     * @param item Item to be removed from the tree.
     */
    delete(item: T): void;

    /**
     * Returns the first occurrence of an item that satisfy the condition by the predicate.
     * @param  predicate The function that will be used to find the items.
     * @return First occurrence of the item that satisfies the predicate. If no item satisfies, returns null.
     */
    find(predicate: (item: T) => boolean): T;

    /**
     * Traverses all the items and call the given action for each of the items.
     * In-order traversing is used.
     * @param action The action that will be called for each item.
     */
    forEach(action: (item: T) => void): void;

    /**
     * Returns the data at the root of this tree.
     * @return the data at the root of the tree.
     */
    getRootData(): T;

    /**
     * Inserts an item to this tree.
     * @param item Item that is to be inserted.
     */
    insert(item: T): void;

    /**
     * Searches for an item in this tree.
     * @param  item Item to be searched.
     * @return true if the item is found, false otherwise.
     */
    search(item: T): boolean;
}