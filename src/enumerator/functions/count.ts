import type { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Counts the number of elements in the sequence, optionally restricted by a predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate that determines which elements are counted. When omitted, all elements are counted.
 * @returns {number} The number of elements that satisfy the predicate.
 * @remarks Prefer calling `any(source)` to test for existence instead of comparing this result with zero.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const totalCount = count(numbers);
 * console.log(totalCount); // 5
 *
 * const evenCount = count(numbers, x => x % 2 === 0);
 * console.log(evenCount); // 2
 * ```
 */
export const count = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): number => {
    if (!predicate) {
        if (Array.isArray(source)) {
            return source.length;
        }
        if (source instanceof Set || source instanceof Map) {
            return source.size;
        }
    }
    return from(source).count(predicate);
};
