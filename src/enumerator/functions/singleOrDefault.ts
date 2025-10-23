import { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Returns the only element that satisfies the provided type guard predicate, or `null` when no such element exists.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
 * @param source The source iterable.
 * @param predicate Type guard evaluated for each element. The returned value is narrowed to `TFiltered` when not `null`.
 * @returns {TFiltered | null} The single matching element, or `null` when no element satisfies {@link predicate}.
 * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
 * @remarks {@link source} is fully enumerated to confirm uniqueness of the matching element.
 * @example
 * ```typescript
 * const numbers = [5];
 * const singleElement = singleOrDefault(numbers);
 * console.log(singleElement); // 5
 *
 * const numbers2 = [1, 2, 3, 4, 5];
 * const singleEven = singleOrDefault(numbers2, x => x > 4);
 * console.log(singleEven); // 5
 *
 * const empty: number[] = [];
 * const singleOfEmpty = singleOrDefault(empty);
 * console.log(singleOfEmpty); // null
 *
 * const noMatch = [1, 2, 3];
 * const singleNoMatch = singleOrDefault(noMatch, x => x > 4);
 * console.log(singleNoMatch); // null
 * ```
 */
export function singleOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered | null;

/**
 * Returns the only element in the sequence or the only element that satisfies an optional predicate, or `null` when no such element exists.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
 * @returns {TElement | null} The single element or matching element, or `null` when no element satisfies the conditions.
 * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
 * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
 * @remarks Unlike {@link single}, this method communicates the absence of a matching element by returning `null`.
 */
export function singleOrDefault<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement | null;
export function singleOrDefault<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered | null {
    return from(source).singleOrDefault(predicate as Predicate<TElement> | undefined);
}
