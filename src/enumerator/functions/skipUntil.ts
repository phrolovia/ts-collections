import { IndexedPredicate, IndexedTypePredicate } from "../../shared/IndexedPredicate";
import { IEnumerable } from "../IEnumerable";
import { from } from "./from";

/**
 * Skips elements until a type guard predicate returns `true`, then yields that element and the remainder, narrowing the element type.
 * @template TElement Type of elements within {@link source}.
 * @template TFiltered extends TElement Result type produced by {@link predicate}.
 * @param source The source iterable.
 * @param predicate Type guard invoked for each element and its zero-based index; once it returns `true`, that element and all following elements are yielded.
 * @returns {IEnumerable<TFiltered>} A deferred sequence starting with the first element that satisfies {@link predicate}.
 * @remarks The predicate's index parameter increments for each inspected element until the condition is met.
 * @example
 * ```typescript
 * const mixed: (number | string)[] = ['a', 'b', 1, 2];
 * const numbers = skipUntil(mixed, (x): x is number => typeof x === 'number').toArray();
 * console.log(numbers); // [1, 2]
 * ```
 */
export function skipUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TFiltered>;

/**
 * Skips elements until a predicate returns `true`, then yields that element and the remainder.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @param predicate Predicate receiving the element and its zero-based index; once it returns `true`, enumeration stops skipping.
 * @returns {IEnumerable<TElement>} A deferred sequence starting with the first element that satisfies {@link predicate}.
 * @remarks The predicate runs until the first match is found; subsequent elements are yielded without further checks.
 * @example
 * ```typescript
 * const numbers = [0, 0, 1, 2, 3];
 * const result = skipUntil(numbers, (_, i) => i >= 2).toArray();
 * console.log(result); // [1, 2, 3]
 * ```
 */
export function skipUntil<TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement>
): IEnumerable<TElement>;

export function skipUntil<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: IndexedPredicate<TElement> | IndexedTypePredicate<TElement, TFiltered>
): IEnumerable<TElement> | IEnumerable<TFiltered> {
    return from(source).skipUntil(predicate);
}
