import { Predicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Determines whether the sequence contains at least one element that matches the optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional function used to test elements. When omitted, the function returns `true` if `source` contains any element.
 * @returns {boolean} `true` when a matching element is found; otherwise, `false`.
 * @remarks When the predicate is omitted, only the first element is inspected, making this more efficient than `count(source) > 0`.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const hasEvenNumber = any(numbers, x => x % 2 === 0);
 * console.log(hasEvenNumber); // true
 *
 * const oddNumbers = [1, 3, 5];
 * const hasEvenNumber2 = any(oddNumbers, x => x % 2 === 0);
 * console.log(hasEvenNumber2); // false
 * ```
 */
export const any = <TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): boolean => {
    return from(source).any(predicate);
};
