import type { PairwiseSelector } from "../../shared/PairwiseSelector";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Creates a deferred sequence of adjacent element pairs drawn from the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param resultSelector Optional projection applied to each current/next pair. Defaults to returning `[current, next]`.
 * @returns {IEnumerable<[TElement, TElement]>} A sequence with one element per consecutive pair from {@link source}.
 * @remarks The final element is omitted because it lacks a successor. {@link source} is enumerated lazily and exactly once.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4];
 * const pairs = pairwise(numbers).toArray();
 * console.log(pairs); // [[1, 2], [2, 3], [3, 4]]
 * ```
 */
export const pairwise = <TElement>(
    source: Iterable<TElement>,
    resultSelector?: PairwiseSelector<TElement, TElement>
): IEnumerable<[TElement, TElement]> => {
    return from(source).pairwise(resultSelector);
};
