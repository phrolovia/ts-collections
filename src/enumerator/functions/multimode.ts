import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Produces the elements whose occurrence count is tied for the highest frequency in {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable to inspect.
 * @param keySelector Optional selector that projects each element to the key used for frequency counting. Defaults to the element itself.
 * @returns {IEnumerable<TElement>} A deferred sequence containing one representative element for each frequency mode.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link keySelector}.
 * @remarks Enumeration of the result buffers the entire source to compute frequency counts before yielding results. When multiple elements share a key, only the first occurrence is emitted.
 * @example
 * ```typescript
 * const modes = multimode([1, 2, 2, 3, 3]).toArray();
 * console.log(modes); // [2, 3]
 * ```
 */
export const multimode = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>
): IEnumerable<TElement> => {
    return from(source).multimode(keySelector);
};
