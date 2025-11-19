import type { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Determines whether {@link source} contains exactly {@link count} elements that satisfy the optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The iterable whose elements are evaluated.
 * @param count Exact number of matching elements required. Must be greater than or equal to 0.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, every element is considered a match.
 * @returns {boolean} `true` when exactly {@link count} matching elements are present; otherwise, `false`.
 * @throws {InvalidArgumentException} Thrown when {@link count} is negative.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the predicate.
 * @remarks Enumeration stops once the running total exceeds {@link count}, preventing unnecessary work on long iterables.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasExactlyThreeOdds = exactly(numbers, 3, n => n % 2 !== 0);
 * console.log(hasExactlyThreeOdds); // true
 * ```
 */
export const exactly = <TElement>(
    source: Iterable<TElement>,
    count: number,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).exactly(count, predicate);
};
