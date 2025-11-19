import { from } from "./from";

/**
 * Materialises {@link source} into a native `Set`.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {Set<TElement>} A set containing the distinct elements from {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using JavaScript's `SameValueZero` semantics.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1];
 * const set = toSet(numbers);
 * console.log(Array.from(set)); // [1, 2, 3]
 * ```
 */
export const toSet = <TElement>(
    source: Iterable<TElement>
): Set<TElement> => {
    return from(source).toSet();
};
