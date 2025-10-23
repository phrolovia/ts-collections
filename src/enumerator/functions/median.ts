import { Selector } from "../../shared/Selector";
import { from } from "./from";
import { MedianTieStrategy } from "../../shared/MedianTieStrategy";

/**
 * Calculates the median of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to treating the element itself as numeric.
 * @param tie Determines how the median is resolved when {@link source} contains an even number of elements. Defaults to `"interpolate"`, which averages the two central values. Specify `"low"` or `"high"` to choose the lower or higher neighbour respectively.
 * @returns {number} The calculated median, or `NaN` when {@link source} contains no elements.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks {@link source} is enumerated once and buffered so a selection algorithm can locate the middle element(s) without fully sorting. Supply {@link selector} when elements are not already numeric.
 * @example
 * ```typescript
 * const medianValue = median([1, 5, 2, 4, 3]);
 * console.log(medianValue); // 3
 *
 * const people = [
 *   { name: 'Alice', age: 23 },
 *   { name: 'Bella', age: 21 },
 *   { name: 'Mirei', age: 22 },
 *   { name: 'Hanna', age: 20 },
 *   { name: 'Noemi', age: 29 }
 * ];
 * const medianAge = median(people, p => p.age);
 * console.log(medianAge); // 22
 * ```
 */
export const median = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>,
    tie?: MedianTieStrategy
): number => {
    return from(source).median(selector, tie);
};
