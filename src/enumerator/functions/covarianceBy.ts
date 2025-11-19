import type { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Calculates the covariance between two numeric projections of {@link source}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable to inspect.
 * @param leftSelector Projection that produces the first numeric series for each element.
 * @param rightSelector Projection that produces the second numeric series for each element.
 * @param sample When `true`, computes the sample covariance dividing by _n - 1_; when `false`, computes the population covariance dividing by _n_. Defaults to `true`.
 * @returns {number} The calculated covariance.
 * @throws {InsufficientElementException} Thrown when fewer than two elements are available.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing the selector projections.
 * @remarks {@link source} is consumed exactly once using an online algorithm that avoids buffering, making it suitable for large datasets.
 * @example
 * ```typescript
 * const points = [
 *   { x: 1, y: 2 },
 *   { x: 2, y: 4 },
 *   { x: 3, y: 6 }
 * ];
 * const covarianceValue = covarianceBy(points, p => p.x, p => p.y);
 * console.log(covarianceValue); // 2
 * ```
 */
export const covarianceBy = <TElement>(
    source: Iterable<TElement>,
    leftSelector: Selector<TElement, number>,
    rightSelector: Selector<TElement, number>,
    sample?: boolean
): number => {
    return from(source).covarianceBy(leftSelector, rightSelector, sample);
};
