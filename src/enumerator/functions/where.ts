import type { IndexedPredicate, IndexedTypePredicate } from "../../shared/IndexedPredicate";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Filters {@link source} using a type guard predicate and narrows the resulting element type.
 * @template TElement Type of elements within {@link source}.
 * @template TFiltered extends TElement Narrowed element type produced by {@link predicate}.
 * @param source The iterable to filter.
 * @param predicate Type guard invoked with each element and its zero-based index. Return `true` to keep the element in the results.
 * @returns {IEnumerable<TFiltered>} A deferred sequence containing only elements that satisfy the type guard.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link predicate}.
 * @remarks Enumeration is lazy; {@link predicate} executes on demand and may be invoked again when consumers restart iteration.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const evenNumbers = where(numbers, x => x % 2 === 0).toArray();
 * console.log(evenNumbers); // [2, 4]
 * ```
 */
export function where<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

/**
 * Filters {@link source} using a predicate that can inspect both the element and its position.
 * @template TElement Type of elements within {@link source}.
 * @param source The iterable to filter.
 * @param predicate Predicate invoked with each element and its zero-based index. Return `true` to keep the element in the results.
 * @returns {IEnumerable<TElement>} A deferred sequence containing only the elements that satisfy {@link predicate}.
 * @throws {unknown} Re-throws any error thrown while iterating {@link source} or executing {@link predicate}.
 * @remarks Enumeration is lazy; {@link predicate} executes on demand and iteration stops as soon as the consumer stops reading.
 */
export function where<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;
export function where<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).where(predicate as IndexedPredicate<TElement>);
}
