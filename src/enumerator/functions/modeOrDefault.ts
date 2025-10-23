import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Returns the element that appears most frequently in {@link source}, or `null` when the iterable is empty.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TKey Type of key produced by {@link keySelector}.
 * @param source The source iterable to inspect.
 * @param keySelector Optional selector that projects each element to the key used for frequency counting. Defaults to the element itself.
 * @returns {TElement | null} The first most frequent element, or `null` when {@link source} contains no elements.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link keySelector}.
 * @remarks Unlike {@link mode}, this function communicates the absence of elements by returning `null`. When multiple keys share the maximum frequency, the element encountered first is returned.
 * @example
 * ```typescript
 * const winner = modeOrDefault<number>([]);
 * console.log(winner); // null
 * ```
 */
export const modeOrDefault = <TElement, TKey>(
    source: Iterable<TElement>,
    keySelector?: Selector<TElement, TKey>
): TElement | null => {
    return from(source).modeOrDefault(keySelector);
};
