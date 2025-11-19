import type { CircularQueue } from "../../queue/CircularQueue";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into a circular queue with the specified capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param capacity Maximum number of elements retained by the resulting queue.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {CircularQueue<TElement>} A circular queue containing the most recent elements from {@link source}, bounded by {@link capacity}.
 * @remarks The entire sequence is enumerated immediately. When {@link source} contains more than {@link capacity} elements, earlier items are discarded.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const circularQueue = toCircularQueue(numbers, 3);
 * console.log(circularQueue.toArray()); // [3, 4, 5]
 * ```
 */
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacity: number,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement>;

/**
 * Materialises {@link source} into a circular queue using the implementation's default capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {CircularQueue<TElement>} A circular queue containing the most recent elements from {@link source}, bounded by the default capacity.
 * @remarks The entire sequence is enumerated immediately. Earlier items are discarded when the number of elements exceeds the queue's capacity.
 */
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement>;
export function toCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacityOrComparator?: number | EqualityComparator<TElement>,
    comparator?: EqualityComparator<TElement>
): CircularQueue<TElement> {
    if (typeof capacityOrComparator === "number") {
        return from(source).toCircularQueue(capacityOrComparator, comparator);
    }
    return from(source).toCircularQueue(capacityOrComparator);
}
