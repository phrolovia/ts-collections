import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Computes the Pearson correlation coefficient between two numeric projections of {@link source}.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable that supplies the data for both projections.
 * @param leftSelector Projection that produces the first numeric series for each element.
 * @param rightSelector Projection that produces the second numeric series for each element.
 * @returns {number} The correlation coefficient in the interval [-1, 1].
 * @throws {InsufficientElementException} Thrown when fewer than two elements are available.
 * @throws {Error} Thrown when the standard deviation of either numeric projection is zero.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the selector projections.
 * @remarks The iterable is enumerated exactly once using an online algorithm, which keeps memory usage constant even for large inputs.
 * @example
 * ```typescript
 * const metrics = [
 *   { impressions: 1_000, clicks: 50 },
 *   { impressions: 1_500, clicks: 75 },
 *   { impressions: 2_000, clicks: 100 }
 * ];
 * const result = correlationBy(metrics, m => m.impressions, m => m.clicks);
 * console.log(result); // 1
 * ```
 */
export const correlationBy = <TElement>(
    source: Iterable<TElement>,
    leftSelector: Selector<TElement, number>,
    rightSelector: Selector<TElement, number>
): number => {
    return from(source).correlationBy(leftSelector, rightSelector);
};
