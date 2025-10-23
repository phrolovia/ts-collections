import { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Returns the first element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element; when omitted, the first element is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered | null} The first matching element, or `null` when no match is found.
 * @remarks This function never throws for missing elements; it communicates absence through the `null` return value.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const firstElement = firstOrDefault(numbers);
 * console.log(firstElement); // 1
 *
 * const firstEven = firstOrDefault(numbers, x => x % 2 === 0);
 * console.log(firstEven); // 2
 *
 * const empty: number[] = [];
 * const firstOfEmpty = firstOrDefault(empty);
 * console.log(firstOfEmpty); // null
 *
 * const noEvens = [1, 3, 5];
 * const firstEven2 = firstOrDefault(noEvens, x => x % 2 === 0);
 * console.log(firstEven2); // null
 * ```
 */
export function firstOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;

/**
 * Returns the first element in the sequence that satisfies an optional predicate, or `null` when none does.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element; when omitted, the first element is returned.
 * @returns {TElement | null} The first element that satisfies {@link predicate}, or `null` when the sequence is empty or no element matches.
 * @remarks This overload never throws for missing elements; use {@link first} when absence should raise an exception.
 */
export function firstOrDefault<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null;
export function firstOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered | null {
    return from(source).firstOrDefault(predicate as Predicate<TElement> | undefined);
}
