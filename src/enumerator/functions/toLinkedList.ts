import { LinkedList } from "../../list/LinkedList";
import { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a linked list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {LinkedList<TElement>} A linked list containing all elements from {@link source} in iteration order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const linkedList = toLinkedList(numbers);
 * console.log(linkedList.toArray()); // [1, 2, 3]
 * ```
 */
export const toLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): LinkedList<TElement> => {
    return from(source).toLinkedList(comparator);
};
