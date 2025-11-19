import { Enumerable } from "../Enumerable";
import type { IEnumerable } from "../IEnumerable";

/**
 * Creates an empty sequence.
 * @template TElement Type of elements that the returned sequence can produce.
 * @returns {IEnumerable<TElement>} A reusable, cached empty sequence.
 * @remarks The returned instance is immutable and can be shared safely across callers.
 * @example
 * ```typescript
 * const emptySequence = empty<number>();
 * console.log(emptySequence.toArray()); // []
 * ```
 */
export const empty = <TElement>(): IEnumerable<TElement> => {
    return Enumerable.empty();
};
