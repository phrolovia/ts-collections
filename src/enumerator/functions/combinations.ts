import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Generates the unique combinations that can be built from the elements in the sequence.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param size Optional number of elements that each combination must contain. When omitted, combinations of every possible length are produced.
 * @returns {IEnumerable<IEnumerable<TElement>>} A sequence of combinations built from the source elements.
 * @throws {InvalidArgumentException} Thrown when `size` is negative.
 * @remarks The source sequence is materialised before combinations are produced, so very large inputs can be expensive. Duplicate combinations produced by repeated elements are emitted only once.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3];
 * const combs = combinations(numbers, 2);
 * console.log(combs.select(c => c.toArray()).toArray()); // [[1, 2], [1, 3], [2, 3]]
 * ```
 */
export const combinations = <TElement>(
    source: Iterable<TElement>,
    size?: number
): IEnumerable<IEnumerable<TElement>> => {
    return from(source).combinations(size);
};
