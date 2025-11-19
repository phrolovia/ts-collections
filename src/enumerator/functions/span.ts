import type { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Splits the sequence into the maximal leading span that satisfies a type guard and the remaining elements.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
 * @param source The source iterable.
 * @param predicate Type guard evaluated for each element until it first returns `false`.
 * @returns {[IEnumerable<TFiltered>, IEnumerable<TElement>]} A tuple containing the contiguous matching prefix and the remainder of the sequence.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 1, 2];
 * const [first, second] = span(numbers, x => x < 3);
 * console.log(first.toArray()); // [1, 2]
 * console.log(second.toArray()); // [3, 4, 1, 2]
 * ```
 */
export function span<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<TElement>];

/**
 * Splits the sequence into the maximal leading span that satisfies a predicate and the remaining elements.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Predicate evaluated for each element until it first returns `false`.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing the contiguous matching prefix and the remainder of the sequence.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating {@link predicate}.
 */
export function span<TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>];
export function span<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
    return from(source).span(predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<TElement>] | [IEnumerable<TElement>, IEnumerable<TElement>];
}
