import { ImmutableSet } from "../../set/ImmutableSet";
import { from } from "./from";

/**
 * Materialises {@link source} into an immutable set containing the distinct elements.
 * @template TElement Type of elements within {@link source}.
 * @param source The source iterable.
 * @returns {ImmutableSet<TElement>} An immutable set built from the distinct elements of {@link source}.
 * @remarks The entire sequence is enumerated immediately and duplicate elements are collapsed using the set's equality semantics.
 * @example
 * ```typescript
 * const numbers = [1, 2, 2, 3, 1];
 * const immutableSet = toImmutableSet(numbers);
 * console.log(immutableSet.toArray()); // [1, 2, 3]
 * ```
 */
export const toImmutableSet = <TElement>(
    source: Iterable<TElement>
): ImmutableSet<TElement> => {
    return from(source).toImmutableSet();
};
