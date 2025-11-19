import type { IndexedPredicate, IndexedTypePredicate } from "../../shared/IndexedPredicate";
import { from } from "./from";
import type { IEnumerable } from "../IEnumerable";

/**
 * Returns consecutive leading elements while a type guard predicate continues to succeed, narrowing the element type.
 * @template TElement Type of elements within {@link source}.
 * @template TFiltered extends TElement Narrowed element type produced by {@link predicate}.
 * @param source The source iterable.
 * @param predicate Type guard invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
 * @returns {IEnumerable<TFiltered>} A deferred sequence containing the contiguous prefix that satisfies {@link predicate}.
 * @remarks Elements after the first failing element are not inspected. Use this overload when you need the result to reflect the guarded type.
 * @example
 * ```typescript
 * const mixed: (number | string)[] = [1, 2, 'three', 4, 5];
 * const numbers = takeWhile(mixed, (x): x is number => typeof x === 'number').toArray();
 * console.log(numbers); // [1, 2]
 * ```
 */
export function takeWhile<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

/**
 * Returns consecutive leading elements while a predicate returns `true`.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param predicate Predicate invoked for each element and its zero-based index; iteration stops immediately when it returns `false`.
 * @returns {IEnumerable<TElement>} A deferred sequence containing the contiguous prefix that satisfies {@link predicate}.
 * @remarks Elements after the first failing element are not inspected.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5, 1, 2];
 * const taken = takeWhile(numbers, x => x < 4).toArray();
 * console.log(taken); // [1, 2, 3]
 *
 * const takenWithIndex = takeWhile(numbers, (x, i) => i < 3).toArray();
 * console.log(takenWithIndex); // [1, 2, 3]
 * ```
 */
export function takeWhile<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;
export function takeWhile<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).takeWhile(predicate as IndexedPredicate<TElement>);
}
