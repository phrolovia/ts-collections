import type { IndexedPredicate } from "../../shared/IndexedPredicate";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Skips elements while a predicate returns `true` and then yields the remaining elements.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Predicate receiving the element and its zero-based index. The first element for which it returns `false` is included in the result.
 * @returns {IEnumerable<TElement>} A deferred sequence starting with the first element that fails {@link predicate}.
 * @remarks The predicate's index parameter increments only while elements are being skipped.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 1, 2];
 * const skipped = skipWhile(numbers, x => x < 4).toArray();
 * console.log(skipped); // [4, 5, 1, 2]
 * ```
 */
export const skipWhile = <TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement> => {
    return from(source).skipWhile(predicate);
};
