import type { Predicate, TypePredicate } from "../../shared/Predicate";
import { from } from "./from";

/**
 * Returns the only element that satisfies the provided type guard predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @template TFiltered extends TElement Narrowed element type produced when {@link predicate} returns `true`.
 * @param source The source iterable.
 * @param predicate Type guard evaluated for each element. The returned value is narrowed to `TFiltered`.
 * @returns {TFiltered} The single element that satisfies {@link predicate}.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @throws {NoMatchingElementException} Thrown when no element satisfies {@link predicate}.
 * @throws {MoreThanOneMatchingElementException} Thrown when more than one element satisfies {@link predicate}.
 * @remarks {@link source} is fully enumerated to ensure exactly one matching element exists.
 * @example
 * ```typescript
 * const numbers = [5];
 * const singleElement = single(numbers);
 * console.log(singleElement); // 5
 *
 * const numbers2 = [1, 2, 3, 4, 5];
 * const singleEven = single(numbers2, x => x > 4);
 * console.log(singleEven); // 5
 * ```
 */
export function single<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate: TypePredicate<TElement, TFiltered>
): TFiltered;

/**
 * Returns the only element in the sequence or the only element that satisfies an optional predicate.
 * @template TElement Type of elements within the {@link source} iterable.
 * @param source The source iterable.
 * @param predicate Optional predicate evaluated for each element. When provided, the result must be the unique element for which it returns `true`.
 * @returns {TElement} The single element in {@link source} or the single element that satisfies {@link predicate}.
 * @throws {NoElementsException} Thrown when {@link source} is empty.
 * @throws {MoreThanOneElementException} Thrown when more than one element exists and {@link predicate} is omitted.
 * @throws {NoMatchingElementException} Thrown when {@link predicate} is provided and no element satisfies it.
 * @throws {MoreThanOneMatchingElementException} Thrown when {@link predicate} is provided and more than one element satisfies it.
 * @remarks {@link source} is fully enumerated to validate uniqueness.
 */
export function single<TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement>
): TElement;
export function single<TElement, TFiltered extends TElement>(
    source: Iterable<TElement>,
    predicate?: Predicate<TElement> | TypePredicate<TElement, TFiltered>
): TElement | TFiltered {
    return from(source).single(predicate as Predicate<TElement> | undefined);
}
