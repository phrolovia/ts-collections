import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Calculates the standard deviation of the numeric values produced by {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param selector Optional projection that extracts the numeric value for each element. Defaults to the element itself.
 * @param sample When `true`, computes the sample standard deviation; when `false`, computes the population standard deviation. Defaults to `true`.
 * @returns {number} The calculated standard deviation, or `NaN` when there are insufficient values to compute it.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link selector}.
 * @remarks This function delegates to {@link variance}; when the variance is `NaN`, that value is returned unchanged. The iterable is enumerated exactly once using a numerically stable single-pass algorithm.
 * @example
 * ```typescript
 * const populationStdDev = standardDeviation([1, 2, 3, 4, 5], x => x, false);
 * console.log(populationStdDev); // Math.sqrt(2)
 * ```
 */
export const standardDeviation = <TElement>(
    source: Iterable<TElement>,
    selector?: Selector<TElement, number>,
    sample?: boolean
): number => {
    return from(source).standardDeviation(selector, sample);
};
