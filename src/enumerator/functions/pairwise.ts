import type { PairwiseSelector } from "../../shared/PairwiseSelector";
import type { IEnumerable } from "../IEnumerable";
import { Enumerator } from "../Enumerator";

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
    const selector = resultSelector ?? ((first: TElement, second: TElement): [TElement, TElement] => [first, second]);
    return new Enumerator(() => pairwiseGenerator(source, selector));
};

function* pairwiseGenerator<TElement>(source: Iterable<TElement>, resultSelector: PairwiseSelector<TElement, TElement>): IterableIterator<[TElement, TElement]> {
    const iterator = source[Symbol.iterator]();
    let next = iterator.next();
    while (!next.done) {
        const previous = next;
        next = iterator.next();
        if (!next.done) {
            yield resultSelector(previous.value, next.value);
        }
    }
}
