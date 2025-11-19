import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Returns a deferred sequence that yields the supplied element before the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param element Element emitted before the original sequence.
 * @returns {IEnumerable<TElement>} A sequence that yields {@link element} followed by the elements from {@link source}.
 * @remarks Enumeration is deferred; {@link source} is not iterated until the resulting sequence is consumed.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const prepended = prepend(numbers, 0).toArray();
 * console.log(prepended); // [0, 1, 2, 3]
 * ```
 */
export const prepend = <TElement>(
    source: Iterable<TElement>,
    element: TElement
): IEnumerable<TElement> => {
    return from(source).prepend(element);
};
