import { Selector } from "../../shared/Selector";
import { from } from "./from";

/**
 * Computes the Pearson correlation coefficient between {@link source} and {@link other}.
 * @template TElement Type of elements within the `source` iterable.
 * @template TSecond Type of elements within the {@link other} iterable.
 * @param source The source iterable whose elements align with {@link other} by index.
 * @param other The iterable that provides the second series of aligned values.
 * @param selector Optional projection that extracts the numeric value for each element of {@link source}. Defaults to treating the element itself as numeric.
 * @param otherSelector Optional projection that extracts the numeric value for each element of {@link other}. Defaults to treating the element itself as numeric.
 * @returns {number} The correlation coefficient in the interval [-1, 1].
 * @throws {DimensionMismatchException} Thrown when the iterables do not contain the same number of elements.
 * @throws {InsufficientElementException} Thrown when fewer than two aligned pairs are available.
 * @throws {Error} Thrown when the standard deviation of either numeric projection is zero.
 * @throws {unknown} Re-throws any error encountered while iterating either iterable or executing the selector projections.
 * @remarks Both iterables are enumerated simultaneously via an online algorithm that avoids buffering the full dataset. Ensure the iterables are aligned because mismatch detection occurs only after enumeration begins.
 * @example
 * ```typescript
 * const temperatures = [15, 18, 21, 24];
 * const sales = [30, 36, 42, 48];
 * const result = correlation(temperatures, sales);
 * console.log(result); // 1
 * ```
 */
export const correlation = <TElement, TSecond>(
    source: Iterable<TElement>,
    other: Iterable<TSecond>,
    selector?: Selector<TElement, number>,
    otherSelector?: Selector<TSecond, number>
): number => {
    return from(source).correlation(other, selector, otherSelector);
};
