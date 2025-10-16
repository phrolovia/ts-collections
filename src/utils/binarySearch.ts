import { Comparators } from "../shared/Comparators";
import { OrderComparator } from "../shared/OrderComparator";
import { IReadonlyList, toImmutableList } from "../imports";

/**
 * Performs a binary search on the given sequence and returns the index of the element. The sequence must be sorted prior to calling this method.
 * If the searched element exists multiple times in the sequence, the returned index is arbitrary.
 * @template TElement The type of the elements
 * @param {Iterable<TElement>} sequence The iterable in which the element will be binary-searched for. It must be sorted.
 * @param {TElement} element The element that will be searched for.
 * @param {OrderComparator} comparator The comparator method that will be used to compare the elements. It should always be provided if the sequence is of a complex type.
 * @return {number} The index of the element that is equal to the searched element. If the element is not found, returns -1.
 */
export const binarySearch = <TElement>(sequence: Iterable<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number  => {
    comparator ??= Comparators.orderComparator;
    if (sequence instanceof Array) {
        return binarySearchArray(sequence, element, comparator);
    }
    const list = toImmutableList(sequence);
    return binarySearchList(list, element, comparator);
}

const binarySearchArray = <TElement>(array: Array<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number => {
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
    return binarySearchArrayCore(array, element, 0, array.length - 1, comparator);
}

const binarySearchArrayCore = <TElement>(array: Array<TElement>, element: TElement, startIndex: number, endIndex: number, comparator: OrderComparator<TElement>): number => {
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
        return binarySearchArrayCore(array, element, startIndex, middleIndex - 1, comparator);
    }
    return binarySearchArrayCore(array, element, middleIndex, endIndex, comparator);
}

const binarySearchList = <TElement>(list: IReadonlyList<TElement>, element: TElement, comparator?: OrderComparator<TElement>): number => {
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
    return binarySearchListCore(list, element, 0, list.size() - 1, comparator);
}

const binarySearchListCore = <TElement>(list: IReadonlyList<TElement>, element: TElement, startIndex: number, endIndex: number, comparator: OrderComparator<TElement>): number => {
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
        return binarySearchListCore(list, element, startIndex, middleIndex - 1, comparator);
    }
    return binarySearchListCore(list, element, middleIndex, endIndex, comparator);
}
