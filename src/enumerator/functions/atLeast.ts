import { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Determines whether {@link source} contains at least {@link count} elements that satisfy the optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The iterable whose elements are evaluated.
 * @param count Minimum number of matching elements required. Must be greater than or equal to 0.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, every element is considered a match.
 * @returns {boolean} `true` when at least {@link count} matching elements are present; otherwise, `false`.
 * @throws {InvalidArgumentException} Thrown when {@link count} is negative.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the predicate.
 * @remarks Enumeration stops as soon as the required number of matches is found, avoiding unnecessary work on long iterables.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasAtLeastTwoEvens = atLeast(numbers, 2, n => n % 2 === 0);
 * console.log(hasAtLeastTwoEvens); // true
 * ```
 */
export const atLeast = <TElement>(
    source: Iterable<TElement>,
    count: number,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).atLeast(count, predicate);
};
