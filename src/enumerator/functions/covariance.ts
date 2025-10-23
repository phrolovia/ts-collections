import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Calculates the covariance between {@link source} and {@link other}.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TSecond Type of elements within {@link other}.
 * @param source The primary iterable whose elements align by index with {@link other}.
 * @param other Secondary iterable supplying the paired values.
 * @param selector Optional projection that extracts the numeric value for each element in {@link source}. Defaults to treating the element itself as numeric.
 * @param otherSelector Optional projection that extracts the numeric value for each element in {@link other}. Defaults to treating the element itself as numeric.
 * @param sample When `true`, computes the sample covariance dividing by _n - 1_; when `false`, computes the population covariance dividing by _n_. Defaults to `true`.
 * @returns {number} The calculated covariance.
 * @throws {DimensionMismatchException} Thrown when {@link source} and {@link other} do not contain the same number of elements.
 * @throws {InsufficientElementException} Thrown when fewer than two aligned pairs are available.
 * @throws {unknown} Re-throws any error thrown while iterating either iterable or executing the selector projections.
 * @remarks Both iterables are consumed simultaneously so streaming statistics can be computed without materialising all elements. Ensure the iterables are aligned because mismatch detection occurs only after iteration begins.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const doubles = [2, 4, 6, 8, 10];
 * const covarianceValue = covariance(numbers, doubles);
 * console.log(covarianceValue); // 5
 * ```
 */
export const covariance = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    selector?: Selector<TElement, number>,
    otherSelector?: Selector<TSecond, number>,
    sample?: boolean
): number => {
    return from(source).covariance(other, selector, otherSelector, sample);
};
