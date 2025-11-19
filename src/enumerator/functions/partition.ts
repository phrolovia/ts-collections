import type { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Splits the sequence into cached partitions using a type guard predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered extends TElement Type produced when {@link predicate} narrows an element.
 * @param source The source iterable.
 * @param predicate Type guard invoked for each element. Elements that satisfy the predicate populate the first partition.
 * @returns {[IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>]} A tuple containing the matching partition and the partition with the remaining elements.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating the predicate.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 6];
 * const [evens, odds] = partition(numbers, x => x % 2 === 0);
 * console.log(evens.toArray()); // [2, 4, 6]
 * console.log(odds.toArray()); // [1, 3, 5]
 * ```
 */
export function partition<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>];

/**
 * Splits the sequence into cached partitions using a boolean predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Predicate evaluated for each element. Elements for which it returns `true` populate the first partition.
 * @returns {[IEnumerable<TElement>, IEnumerable<TElement>]} A tuple containing the elements that satisfied {@link predicate} and those that did not.
 * @remarks {@link source} is fully enumerated immediately and buffered so both partitions can be iterated repeatedly without re-evaluating the predicate.
 */
export function partition<TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement>
): [IEnumerable<TElement>, IEnumerable<TElement>];
export function partition<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>] {
    return from(source).partition(predicate as Predicate<TElement>) as [IEnumerable<TFiltered>, IEnumerable<Exclude<TElement, TFiltered>>] | [IEnumerable<TElement>, IEnumerable<TElement>];
}
