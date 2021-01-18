import {OrderComparator} from "../shared/OrderComparator";
import {IList} from "../list/IList";
import {Comparators} from "../shared/Comparators";
import {ICollection} from "./ICollection";
import {ErrorMessages} from "../shared/ErrorMessages";

export abstract class Collections {
    /* istanbul ignore next */
    private constructor() {
    }

    /**
     * Add all the given elements to the collection
     * @param {ICollection} collection The collection to which the elements will be added.
     * @param {TElement} elements The elements that will be added to the given collection.
     * @return {boolean} true if collection is modified, false otherwise.
     */
    public static addAll<TElement, TSource extends TElement>(collection: ICollection<TSource>, ...elements: TElement[]): boolean {
        const oldSize = collection.size();
        for (const element of elements) {
            collection.add(element as TSource);
        }
        return collection.size() !== oldSize;
    }

    /**
     * Performs a binary search on the given list and returns the index of the element. The list must be sorted prior to calling this method.
     * If the searched element exists multiple times in the list, the returned index is arbitrary.
     * @param {IList} list The list in which the element will be binary-searched for. It must be sorted.
     * @param {TElement} element The element that will be searched for.
     * @param {OrderComparator} comparator The comparator method that will be used to compare the elements. It should always be provided if the list is of a complex type.
     * @return {number} The index of the element that is equal to the searched element. If the element is not found, returns -1.
     */
    public static binarySearch<TElement>(list: IList<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number {
        comparator ??= Comparators.orderComparator;
        if (list.isEmpty()) {
            return -1;
        }
        if (list.size() === 1) {
            if (comparator(list.get(0), element) === 0) {
                return 0;
            }
            return -1;
        }
        return Collections.binarySearchCore(list, element, 0, list.size() - 1, comparator);
    }

    /**
     * Replaces all the elements of the list with the given element.
     * @param {IList} list The list whose elements will be replaced
     * @param {TElement} element The element which will replace the elements of the list
     */
    public static fill<TElement>(list: IList<TElement>, element: TElement): void {
        for (let ix = 0; ix < list.size(); ++ix) {
            list.set(ix, element);
        }
    }

    /**
     * Swaps the elements of the list at the given indices.
     * @param {IList} list The list whose two elements will be swapped
     * @param {number} firstIndex The first index of the swap operation
     * @param {number} secondIndex The second index of the swap operation
     * @throws {Error} IndexOutOfBoundsException if the given indices are out of list's bounds.
     */
    public static swap<TElement>(list: IList<TElement>, firstIndex: number, secondIndex: number): void {
        if (firstIndex < 0 || firstIndex >= list.size() || secondIndex < 0 || secondIndex >= list.size()) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        const temp = list.get(firstIndex);
        list.set(firstIndex, list.get(secondIndex));
        list.set(secondIndex, temp);
    }

    private static binarySearchCore<TElement>(list: IList<TElement>, element: TElement, startIndex: number, endIndex: number, comparator: OrderComparator<TElement>): number {
        if (startIndex === endIndex) {
            if (comparator(list.get(startIndex), element) === 0) {
                return startIndex;
            }
            return -1;
        }
        const middleIndex = Math.ceil((endIndex - startIndex) / 2 + startIndex);
        const comparatorResult = comparator(element, list.get(middleIndex));
        if (comparatorResult === 0) {
            return middleIndex;
        }
        if (comparatorResult < 0) {
            return Collections.binarySearchCore(list, element, startIndex, middleIndex - 1, comparator);
        }
        return Collections.binarySearchCore(list, element, middleIndex, endIndex, comparator);
    }
}
