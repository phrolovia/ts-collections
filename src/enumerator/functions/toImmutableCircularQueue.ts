import type { ImmutableCircularQueue } from "../../queue/ImmutableCircularQueue";
import type { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable circular queue that uses the implementation's default capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing the most recent elements from {@link source}, up to the default capacity.
 * @remarks The entire sequence is enumerated immediately. Earlier items are discarded when the number of elements exceeds the queue's capacity (currently 32).
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableCircularQueue = toImmutableCircularQueue(numbers);
 * console.log(immutableCircularQueue.toArray()); // [1, 2, 3]
 * ```
 */
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement>;

/**
 * Materialises {@link source} into an immutable circular queue with the specified capacity.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param capacity Maximum number of elements retained by the resulting queue.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {ImmutableCircularQueue<TElement>} An immutable circular queue containing the most recent elements from {@link source}, bounded by {@link capacity}.
 * @remarks The entire sequence is enumerated immediately. When {@link source} contains more than {@link capacity} elements, earlier items are discarded.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const immutableCircularQueue = toImmutableCircularQueue(numbers, 3);
 * console.log(immutableCircularQueue.toArray()); // [3, 4, 5]
 * ```
 */
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacity: number,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement>;
export function toImmutableCircularQueue<TElement>(
    source: Iterable<TElement>,
    capacityOrComparator?: number | EqualityComparator<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableCircularQueue<TElement> {
    if (typeof capacityOrComparator === "number") {
        return from(source).toImmutableCircularQueue(capacityOrComparator, comparator);
    }
    return from(source).toImmutableCircularQueue(capacityOrComparator);
}
