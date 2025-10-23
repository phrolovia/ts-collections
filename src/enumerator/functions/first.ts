import { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Returns the first element in the sequence, optionally filtered by a predicate or type guard.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element; when omitted, the first element is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered} The first element that satisfies the predicate (or the very first element when none is provided).
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks Enumeration stops immediately once a matching element is found.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const firstElement = first(numbers);
 * console.log(firstElement); // 1
 *
 * const firstEven = first(numbers, x => x % 2 === 0);
 * console.log(firstEven); // 2
 * ```
 */
export function first<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;

/**
 * Returns the first element in the sequence that satisfies an optional predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element; when omitted, the first element is returned.
 * @returns {TElement} The first element that satisfies {@link predicate}, or the very first element when the predicate is missing.
 * @throws {NoElementsException} Thrown when the sequence is empty.
 * @throws {NoMatchingElementException} Thrown when a predicate is supplied and no element satisfies it.
 * @remarks Enumeration stops immediately once a matching element is found.
 */
export function first<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement;
export function first<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered {
    return from(source).first(predicate as Predicate<TElement> | undefined);
}
