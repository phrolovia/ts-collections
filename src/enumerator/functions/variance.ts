import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Calculates the variance of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @param sample When `true`, computes the sample variance dividing by _n - 1_; when `false`, computes the population variance dividing by _n_. Defaults to `true`.
 * @returns {number} The calculated variance, or `NaN` when {@link source} is empty—or for sample variance when it contains a single element.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks A numerically stable single-pass algorithm (Welford's method) is used, so the iterable is enumerated exactly once regardless of size.
 * @example
 * ```typescript
 * const populationVariance = variance([1, 2, 3, 4, 5], x => x, false);
 * console.log(populationVariance); // 2
 * ```
 */
export const variance = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>,
    sample?: boolean
): number => {
    return from(source).variance(selector, sample);
};
