import { ImmutableQueue } from "../../queue/ImmutableQueue";
import { EqualityComparator } from "../../shared/EqualityComparator";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable FIFO queue.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param comparator Optional equality comparator used by the resulting queue.
 * @returns {ImmutableQueue<TElement>} An immutable queue containing all elements from {@link source} in enqueue order.
 * @remarks The entire sequence is enumerated immediately.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const immutableQueue = toImmutableQueue(numbers);
 * console.log(immutableQueue.toArray()); // [1, 2, 3]
 * ```
 */
export const toImmutableQueue = <TElement>(
    source: Iterable<TElement>,
    comparator?: EqualityComparator<TElement>
): ImmutableQueue<TElement> => {
    return from(source).toImmutableQueue(comparator);
};
