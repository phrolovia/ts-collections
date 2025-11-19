import type { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Returns the last element in the sequence, optionally filtered by a predicate or type guard.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered} The last element that satisfies the predicate (or the final element when no predicate is supplied).
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks The entire sequence is enumerated to locate the final match.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const lastElement = last(numbers);
 * console.log(lastElement); // 5
 *
 * const lastEven = last(numbers, x => x % 2 === 0);
 * console.log(lastEven); // 4
 * ```
 */
export function last<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;

/**
 * Returns the last element in the sequence that satisfies an optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the final element of the sequence is returned.
 * @returns {TElement} The last element that satisfies {@link predicate}, or the final element when no predicate is supplied.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks The entire sequence is enumerated to locate the final match.
 */
export function last<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement;
export function last<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered {
    return from(source).last(predicate as Predicate<TElement> | undefined);
}
