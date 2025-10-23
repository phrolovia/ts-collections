import { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Determines whether every element in the sequence satisfies the supplied predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Function that evaluates each element and returns `true` when it satisfies the condition.
 * @returns {boolean} `true` when all elements satisfy the predicate; otherwise, `false`.
 * @remarks Enumeration stops as soon as the predicate returns `false`.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const allPositive = all(numbers, x => x > 0);
 * console.log(allPositive); // true
 *
 * const mixedNumbers = [-1, 2, 3, -4, 5];
 * const allPositive2 = all(mixedNumbers, x => x > 0);
 * console.log(allPositive2); // false
 * ```
 */
export const all = <TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): boolean => {
    return from(source).all(predicate);
};
