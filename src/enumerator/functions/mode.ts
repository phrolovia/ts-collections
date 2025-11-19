import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Returns the element that appears most frequently in {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable to inspect.
 * @param keySelector Optional selector that projects each element to the key used for frequency counting. Defaults to the element itself.
 * @returns {TElement} The first element whose occurrence count matches the maximum frequency.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link keySelector}.
 * @remarks The source iterable is fully enumerated to build frequency counts before the result is determined. When multiple keys share the same frequency, the earliest corresponding element is returned.
 * @example
 * ```typescript
 * const winner = mode([1, 2, 2, 3]);
 * console.log(winner); // 2
 * ```
 */
export const mode = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>,
): TElement => {
    return from(source).mode(keySelector);
};
