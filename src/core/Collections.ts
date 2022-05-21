import {OrderComparator} from "../shared/OrderComparator";
import {IList} from "../list/IList";
import {Comparators} from "../shared/Comparators";
import {ICollection} from "./ICollection";
import {ErrorMessages} from "../shared/ErrorMessages";
import {EqualityComparator} from "../shared/EqualityComparator";
import {IEnumerable} from "../enumerator/IEnumerable";
import {List} from "../list/List";

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
     * Performs a binary search on the given sequence and returns the index of the element. The sequence must be sorted prior to calling this method.
     * If the searched element exists multiple times in the sequence, the returned index is arbitrary.
     * @param {IList|Array} sequence The list or array in which the element will be binary-searched for. It must be sorted.
     * @param {TElement} element The element that will be searched for.
     * @param {OrderComparator} comparator The comparator method that will be used to compare the elements. It should always be provided if the sequence is of a complex type.
     * @return {number} The index of the element that is equal to the searched element. If the element is not found, returns -1.
     */
    public static binarySearch<TElement>(sequence: IList<TElement> | Array<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number {
        comparator ??= Comparators.orderComparator;
        if (sequence instanceof Array) {
            return Collections.binarySearchArray(sequence, element, comparator);
        }
        return Collections.binarySearchList(sequence, element, comparator);
    }

    /**
     * Returns true if the two specified iterables have no elements in common.
     * @param iterable1 First collection of items
     * @param iterable2 Second collection of items
     * @param comparator The comparator method that will be used to compare the elements. It should always be provided if the sequence is of a complex type.
     * @return {boolean} true if the two specified iterables have no elements in common.
     */
    public static disjoint<TFirst, TSecond = TFirst>(iterable1: Iterable<TFirst>, iterable2: Iterable<TSecond>, comparator?: EqualityComparator<TFirst, TSecond>): boolean {
        comparator ??= Comparators.equalityComparator;
        for (const element1 of iterable1) {
            for (const element2 of iterable2) {
                if (comparator(element1, element2)) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * Returns an array of distinct element from a given iterable source.
     * @param iterable Collection of items
     * @param selector A method that will be used to return a key which will be used to determine the distinctness. If not provided,
     *                 then the item itself will be used as the key.
     * @param comparator A method that will be used to compare the equality of the selector keys.
     * @return An array of distinct items.
     * @throws An error if the iterable is null or undefined.
     */
    public static distinct<TElement, TKey>(iterable: Iterable<TElement>, selector?: (item: TElement) => TKey, comparator?: (key1: TKey, key2: TKey) => boolean): IEnumerable<TElement> {
        if (iterable == null) {
            throw new Error("Invalid data source!");
        }
        selector ??= (item: TElement) => item as unknown as TKey;
        comparator ??= (key1: TKey, key2: TKey) => Object.is(key1, key2);
        const distinctList = new List<TElement>();
        for (const item of iterable) {
            let exists = false;
            for (const distinctItem of distinctList) {
                if (comparator(selector(item), selector(distinctItem))) {
                    exists = true;
                    break;
                }
            }
            if (!exists) {
                distinctList.add(item);
            }
        }
        return distinctList;
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
     * Finds the count of the given element in the source iterable.
     * @param {Iterable} source The iterable source in which the given element will be counted.
     * @param {TElement} element The element that will be counted.
     * @param {EqualityComparator} comparator The comparator method that will be used to compare the equality of the elements.
     */
    public static frequency<TElement>(source: Iterable<TElement>, element: TElement, comparator?: EqualityComparator<TElement>): number {
        comparator ??= Comparators.equalityComparator;
        let frequency: number = 0;
        for (const item of source) {
            frequency += +comparator(element, item);
        }
        return frequency;
    }

    /**
     * Finds the maximum item in an iterable source.
     * @param iterable The data source
     * @param selector A selector method which will return a key that will be used for comparison.
     * @return The item which has the maximum value according to the selector method, or null if iterable is empty.
     * @throws An exception if iterable is null or undefined.
     */
    public static max<TElement>(iterable: Iterable<TElement>, selector?: (item: TElement) => number): TElement {
        if (iterable == null) {
            throw new Error("Invalid data source!");
        }
        const iterator = iterable[Symbol.iterator]();
        let iteratorItem = iterator.next();
        let maxItem: TElement;
        if (iteratorItem.done) {
            return null;
        }
        maxItem = iteratorItem.value;
        while (!iteratorItem.done) {
            if (selector) {
                const value = selector(iteratorItem.value);
                const maxValue = selector(maxItem);
                if (value > maxValue) {
                    maxItem = iteratorItem.value;
                }
            } else {
                if (iteratorItem.value > maxItem) {
                    maxItem = iteratorItem.value;
                }
            }
            iteratorItem = iterator.next();
        }
        return maxItem;
    }

    /**
     * Finds the minimum item in an iterable source.
     * @param iterable The data source
     * @param selector A selector method which will return a key that will be used for comparison.
     * @return The item which has the minimum value according to the selector method, or null if iterable is empty.
     * @throws An exception if iterable is null or undefined.
     */
    public static min<TElement>(iterable: Iterable<TElement>, selector?: (item: TElement) => number): TElement {
        if (iterable == null) {
            throw new Error("Invalid data source!");
        }
        const iterator = iterable[Symbol.iterator]();
        let iteratorItem = iterator.next();
        let minItem: TElement;
        if (iteratorItem.done) {
            return null;
        }
        minItem = iteratorItem.value;
        while (!iteratorItem.done) {
            if (selector) {
                const value = selector(iteratorItem.value);
                const minValue = selector(minItem);
                if (value < minValue) {
                    minItem = iteratorItem.value;
                }
            } else {
                if (iteratorItem.value < minItem) {
                    minItem = iteratorItem.value;
                }
            }
            iteratorItem = iterator.next();
        }
        return minItem;
    }

    /**
     * Replaces the old element with the new element in a given sequence.
     * @param {IList|Array} sequence The sequence whose old elements will be replaced.
     * @param {TElement} oldElement The element that will be replaced with the new element.
     * @param {TElement} newElement The element that will replace the old element.
     * @param {EqualityComparator} comparator The comparator method that will be used to compare the equality of the elements.
     */
    public static replaceAll<TElement>(sequence: IList<TElement> | Array<TElement>, oldElement: TElement, newElement: TElement, comparator?: EqualityComparator<TElement>): boolean {
        comparator ??= Comparators.equalityComparator;
        if (sequence instanceof Array) {
            return Collections.replaceAllArray(sequence, oldElement, newElement, comparator);
        }
        return Collections.replaceAllList(sequence, oldElement, newElement, comparator);
    }

    /**
     * Swaps the elements of the list at the given indices.
     * @param {IList|Array} sequence The list or array whose two elements will be swapped
     * @param {number} firstIndex The first index of the swap operation
     * @param {number} secondIndex The second index of the swap operation
     * @throws {Error} IndexOutOfBoundsException if the given indices are out of bounds.
     */
    public static swap<TElement>(sequence: IList<TElement> | Array<TElement>, firstIndex: number, secondIndex: number): void {
        const size = sequence instanceof Array ? sequence.length : sequence.size();
        if (firstIndex < 0 || firstIndex >= size || secondIndex < 0 || secondIndex >= size) {
            throw new Error(ErrorMessages.IndexOutOfBoundsException);
        }
        if (sequence instanceof Array) {
            [sequence[firstIndex], sequence[secondIndex]] = [sequence[secondIndex], sequence[firstIndex]];
            return;
        }
        const temp = sequence.get(firstIndex);
        sequence.set(firstIndex, sequence.get(secondIndex));
        sequence.set(secondIndex, temp);
    }

    private static binarySearchArray<TElement>(array: Array<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number {
        comparator ??= Comparators.orderComparator;
        if (array.length === 0) {
            return -1;
        }
        if (array.length === 1) {
            if (comparator(array[0], element) === 0) {
                return 0;
            }
            return -1;
        }
        return Collections.binarySearchArrayCore(array, element, 0, array.length - 1, comparator);
    }

    private static binarySearchArrayCore<TElement>(array: Array<TElement>, element: TElement, startIndex: number, endIndex: number, comparator: OrderComparator<TElement>): number {
        if (startIndex === endIndex) {
            if (comparator(array[startIndex], element) === 0) {
                return startIndex;
            }
            return -1;
        }
        const middleIndex = Math.ceil((endIndex - startIndex) / 2 + startIndex);
        const comparatorResult = comparator(element, array[middleIndex]);
        if (comparatorResult === 0) {
            return middleIndex;
        }
        if (comparatorResult < 0) {
            return Collections.binarySearchArrayCore(array, element, startIndex, middleIndex - 1, comparator);
        }
        return Collections.binarySearchArrayCore(array, element, middleIndex, endIndex, comparator);
    }

    private static binarySearchList<TElement>(list: IList<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number {
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
        return Collections.binarySearchListCore(list, element, 0, list.size() - 1, comparator);
    }

    private static binarySearchListCore<TElement>(list: IList<TElement>, element: TElement, startIndex: number, endIndex: number, comparator: OrderComparator<TElement>): number {
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
            return Collections.binarySearchListCore(list, element, startIndex, middleIndex - 1, comparator);
        }
        return Collections.binarySearchListCore(list, element, middleIndex, endIndex, comparator);
    }

    private static replaceAllArray<TElement>(array: Array<TElement>, oldElement: TElement, newElement: TElement, comparator: EqualityComparator<TElement>): boolean {
        let replaced = false;
        for (const [index, element] of array.entries()) {
            if (comparator(element, oldElement)) {
                array[index] = newElement;
                replaced = true;
            }
        }
        return replaced;
    }

    private static replaceAllList<TElement>(list: IList<TElement>, oldElement: TElement, newElement: TElement, comparator: EqualityComparator<TElement>): boolean {
        let replaced = false;
        for (const [index, element] of list.entries()) {
            if (comparator(element, oldElement)) {
                list.set(index, newElement);
                replaced = true;
            }
        }
        return replaced;
    }
}
