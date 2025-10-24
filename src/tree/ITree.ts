import { IRandomAccessCollection } from "../core/IRandomAccessCollection";
import { Predicate } from "../shared/Predicate";

export type TraverseType = "INORDER" | "PREORDER" | "POSTORDER";

export interface ITree<TElement> extends IRandomAccessCollection<TElement> {

    /**
     * Deletes the given item from the tree.
     * @param element Item to be removed from the tree.
     */
    delete(element: TElement): void;

    /**
     * Returns the first occurrence of an item that satisfy the condition by the predicate.
     * @param  predicate The function that will be used to find the items.
     * @return First occurrence of the item that satisfies the predicate. If no item satisfies, returns null.
     */
    find(predicate: Predicate<TElement>): TElement | null;

    /**
     * Returns the data at the root of this tree.
     * @return The data at the root of the tree.
     */
    getRootData(): TElement | null;

    /**
     * Inserts an item to this tree.
     * @param element Item that is to be inserted.
     */
    insert(element: TElement): void;

    /**
     * Searches for an item in this tree.
     * @param  element Item to be searched.
     * @return true if the item is found, false otherwise.
     */
    search(element: TElement): boolean;
}
