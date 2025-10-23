import { PriorityQueue } from "../../queue/PriorityQueue";
import { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a priority queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements in the resulting queue.
 * @returns {PriorityQueue<TElement>} A priority queue containing all elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately. Elements are ordered according to {@link comparator} or the default ordering.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const priorityQueue = toPriorityQueue(numbers);
 * console.log(priorityQueue.dequeue()); // 1
 * console.log(priorityQueue.dequeue()); // 1
 * ```
 */
export const toPriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): PriorityQueue<TElement> => {
    return from(source).toPriorityQueue(comparator);
};
