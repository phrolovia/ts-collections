import type { CircularLinkedList } from "../../list/CircularLinkedList";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a circular linked list.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting list.
 * @returns {CircularLinkedList<TElement>} A circular linked list containing all elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately, and elements are stored in iteration order.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const circularList = toCircularLinkedList(numbers);
 * console.log(circularList.toArray()); // [1, 2, 3]
 * ```
 */
export const toCircularLinkedList = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularLinkedList<TElement> => {
    return from(source).toCircularLinkedList(comparator);
};
