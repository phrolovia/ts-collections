import { ImmutablePriorityQueue } from "../../queue/ImmutablePriorityQueue";
import { OrderComparator } from "../../shared/OrderComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable priority queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional order comparator used to compare elements in the resulting queue.
 * @returns {ImmutablePriorityQueue<TElement>} An immutable priority queue containing all elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately. Elements are ordered according to {@link comparator} or the default ordering.
 * @example
 * ```typescript
 * const numbers = [3, 1, 4, 1, 5, 9, 2, 6];
 * const immutablePriorityQueue = toImmutablePriorityQueue(numbers);
 * console.log(immutablePriorityQueue.toArray()); // [1, 1, 2, 3, 4, 5, 6, 9] (sorted)
 * ```
 */
export const toImmutablePriorityQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: OrderComparator<TElement>
): ImmutablePriorityQueue<TElement> => {
    return from(source).toImmutablePriorityQueue(comparator);
};
