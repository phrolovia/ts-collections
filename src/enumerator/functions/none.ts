import type { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Determines whether the sequence contains no elements that satisfy the optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the function returns `true` if the sequence is empty.
 * @returns {boolean} `true` when no element satisfies the predicate (or when the sequence is empty and no predicate is provided); otherwise, `false`.
 * @remarks This is more efficient than negating `any` with a predicate because iteration stops as soon as a matching element is found.
 * @example
 * ```typescript
 * const numbers = [1, 3, 5];
 * const noEvens = none(numbers, x => x % 2 === 0);
 * console.log(noEvens); // true
 *
 * const mixedNumbers = [1, 2, 3, 5];
 * const noEvens2 = none(mixedNumbers, x => x % 2 === 0);
 * console.log(noEvens2); // false
 * ```
 */
export const none = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).none(predicate);
};
