import type { Selector } from "../../shared/Selector";
import { from } from "./from";
import type { PercentileStrategy } from "../../shared/PercentileStrategy";

/**
 * Calculates a percentile of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param percent Percentile expressed as a fraction between 0 and 1 where `0` corresponds to the minimum and `1` to the maximum.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to treating the element itself as numeric.
 * @param strategy Strategy that determines how fractional ranks are resolved. Defaults to `"linear"`, which interpolates between neighbouring values. Alternative strategies include `"nearest"`, `"low"`, `"high"`, and `"midpoint"`.
 * @returns {number} The percentile value, or `NaN` when {@link source} contains no elements.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks {@link source} is enumerated once and buffered so the selection algorithm can determine the requested rank without fully sorting the data. When {@link percent} is outside `[0, 1]`, the result is clamped to the range implied by {@link strategy}.
 * @example
 * ```typescript
 * const upperQuartile = percentile([1, 2, 3, 4, 5], 0.75);
 * console.log(upperQuartile); // 4
 *
 * const responseTimes = [
 *   { endpoint: '/users', duration: 120 },
 *   { endpoint: '/users', duration: 80 },
 *   { endpoint: '/users', duration: 200 }
 * ];
 * const p95 = percentile(responseTimes, 0.95, r => r.duration, "nearest");
 * console.log(p95); // 200
 * ```
 */
export const percentile = <TElement>(
    source: Iterable<TElement>,
    percent: number,
    selector?: Selector<TElement, number>,
    strategy?: PercentileStrategy
): number => {
    return from(source).percentile(percent, selector, strategy);
}
