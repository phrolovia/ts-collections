import type { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Determines whether {@link source} contains no more than {@link count} elements that satisfy the optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The iterable whose elements are evaluated.
 * @param count Maximum number of matching elements allowed. Must be greater than or equal to 0.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, every element is considered a match.
 * @returns {boolean} `true` when the number of matching elements does not exceed {@link count}; otherwise, `false`.
 * @throws {InvalidArgumentException} Thrown when {@link count} is negative.
 * @throws {unknown} Re-throws any error encountered while iterating {@link source} or executing the predicate.
 * @remarks Enumeration stops as soon as the count is exceeded, making it efficient for large or infinite iterables.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasAtMostOneEven = atMost(numbers, 1, n => n % 2 === 0);
 * console.log(hasAtMostOneEven); // false
 * ```
 */
export const atMost = <TElement>(
    source: Iterable<TElement>,
    count: number,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).atMost(count, predicate);
};
