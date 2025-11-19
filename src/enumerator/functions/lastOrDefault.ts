import type { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Returns the last element in the sequence or `null` when the sequence is empty or no element satisfies the predicate.
 * @template TElement Type of elements within the `source` iterable.
 * @template TFiltered Subtype confirmed when a type guard predicate is supplied.
 * @param source The source iterable.
 * @param predicate Predicate evaluated against each element. When omitted, the last element of the sequence is returned. When a type guard is supplied, the returned value is narrowed to `TFiltered`.
 * @returns {TElement | TFiltered | null} The last element that satisfies the predicate, or `null` when no match is found.
 * @remarks The entire sequence is enumerated to locate the final match. This function never throws for missing elements; it communicates absence through the `null` return value.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const lastElement = lastOrDefault(numbers);
 * console.log(lastElement); // 5
 *
 * const lastEven = lastOrDefault(numbers, x => x % 2 === 0);
 * console.log(lastEven); // 4
 *
 * const empty: number[] = [];
 * const lastOfEmpty = lastOrDefault(empty);
 * console.log(lastOfEmpty); // null
 *
 * const noEvens = [1, 3, 5];
 * const lastEven2 = lastOrDefault(noEvens, x => x % 2 === 0);
 * console.log(lastEven2); // null
 * ```
 */
export function lastOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;

/**
 * Returns the last element in the sequence that satisfies an optional predicate, or `null` when none does.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated against each element. When omitted, the final element of the sequence is returned.
 * @returns {TElement | null} The last element that satisfies {@link predicate}, or `null` when the sequence is empty or no element matches.
 * @remarks Unlike {@link last}, this overload communicates absence through `null` instead of throwing.
 */
export function lastOrDefault<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null;
export function lastOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered | null {
    return from(source).lastOrDefault(predicate as Predicate<TElement> | undefined);
}
