import { from } from "./from";
import { IEnumerable } from "../IEnumerable";

/**
 * Returns a deferred sequence that rotates the elements by the specified offset while preserving length.
 * @template TElement Type of elements within the `source` iterable.
 * @param source The source iterable.
 * @param shift Number of positions to rotate. Positive values move elements toward the end (left rotation); negative values move them toward the beginning (right rotation).
 * @returns {IEnumerable<TElement>} A sequence containing the same elements shifted by the requested amount.
 * @remarks The source is buffered sufficiently to honour the rotation. Rotation amounts larger than the length of {@link source} are normalised by that length, which may require buffering the full sequence.
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const rotated = rotate(numbers, 2).toArray();
 * console.log(rotated); // [3, 4, 5, 1, 2]
 *
 * const rotatedNegative = rotate(numbers, -2).toArray();
 * console.log(rotatedNegative); // [4, 5, 1, 2, 3]
 * ```
 */
export const rotate = <TElement>(source: Iterable<TElement>, shift: number): IEnumerable<TElement> => {
    return from(source).rotate(shift);
};
