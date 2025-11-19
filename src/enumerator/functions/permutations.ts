import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Generates permutations from the distinct elements of the source iterable.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Optional target length for each permutation. When omitted, permutations use all distinct elements of the source.
 * @returns {IEnumerable<IEnumerable<TElement>>} A lazy sequence of permutations, each materialised as an enumerable.
 * @throws {InvalidArgumentException} Thrown when {@link size} is less than 1 or greater than the number of distinct elements.
 * @remarks {@link source} is enumerated to collect distinct elements before permutations are produced. Expect combinatorial growth in the number of permutations.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const perms = permutations(numbers, 2);
 * console.log(perms.select(p => p.toArray()).toArray()); // [[1, 2], [1, 3], [2, 1], [2, 3], [3, 1], [3, 2]]
 * ```
 */
export const permutations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).permutations(size);
};
