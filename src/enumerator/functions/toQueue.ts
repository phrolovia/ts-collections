import type { Queue } from "../../queue/Queue";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a FIFO queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {Queue<TElement>} A queue containing all elements from {@link source} in enqueue order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const queue = toQueue(numbers);
 * console.log(queue.dequeue()); // 1
 * console.log(queue.dequeue()); // 2
 * ```
 */
export const toQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): Queue<TElement> => {
    return from(source).toQueue(comparator);
};
