import { IndexedSelector } from "../../shared/IndexedSelector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Projects each element and index into an iterable and flattens the results into a single sequence.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TResult Element type produced by the flattened iterables.
 * @param source The source iterable.
 * @param selector Projection that returns an iterable for each element and its index.
 * @returns {IEnumerable<TResult>} A deferred sequence containing the concatenated contents of the iterables produced by {@link selector}.
 * @remarks Each inner iterable is fully enumerated in order before the next source element is processed, preserving the relative ordering of results.
 * @example
 * ```typescript
 * const lists = [[1, 2], [3, 4], [5]];
 * const flattened = selectMany(lists, x => x).toArray();
 * console.log(flattened); // [1, 2, 3, 4, 5]
 * ```
 */
export const selectMany = <TElement, TResult>(
    source: Iterable<TElement>,
    selector: IndexedSelector<TElement, Iterable<TResult>>
): IEnumerable<TResult> => {
    return from(source).selectMany(selector);
};
